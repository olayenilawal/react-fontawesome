import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import '../assets/css/submittedman.css';
import { firestore, storage } from '../firebase/firebase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


// Adjust the path to your Firebase configuration file


const SubmittedManuscriptsTable = ({ manuscripts, handleAction }) => {
  const [showAbstractPopup, setShowAbstractPopup] = useState(false);
  const [currentAbstract, setCurrentAbstract] = useState('');

  const fetchAbstract = async (manuscriptId) => {
    try {
      console.log('Fetching abstract for manuscript ID:', manuscriptId);
      const manuscriptRef = firestore.collection('SubmittedManuscripts').where('ID', '==', manuscriptId);
      const querySnapshot = await manuscriptRef.get();

      console.log('Query results:', querySnapshot.docs);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]; // Assuming there's only one matching document
        const data = doc.data();
        const abstract = data.abstract;

        if (abstract) {
          setCurrentAbstract(abstract);
          setShowAbstractPopup(true);
        } else {
          console.log('Abstract not found in the manuscript data.');
        }
      } else {
        console.log('No document found for ID:', manuscriptId);
      }
    } catch (error) {
      console.error('Error fetching abstract:', error);
    }
  };


  const closeAbstractPopup = () => {
    setShowAbstractPopup(false);
    setCurrentAbstract('');
  };

  // const downloadManuscript = async (fullPagesUrl) => {
  //   try {
  //     const storageRef = storage.refFromURL(fullPagesUrl);
  //     const downloadUrl = await storageRef.getDownloadURL();
  //     window.open(downloadUrl); 
  //   } catch (error) {
  //     console.error('Error downloading manuscript:', error);
  //   }
  // };

  const downloadFile = async (fileUrl) => {
    try {
      const storageRef = storage.refFromURL(fileUrl);
      const downloadUrl = await storageRef.getDownloadURL();
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  const viewImageAsPdf = async (imageUrl, outputFormat) => {
    try {
      const imageElement = new Image();
      imageElement.src = imageUrl;
  
      imageElement.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageElement, 0, 0);
  
        let imgData;
        if (outputFormat === 'png') {
          imgData = canvas.toDataURL('image/png');
        } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
          imgData = canvas.toDataURL('image/jpeg', 1.0); // Quality parameter (0.0 - 1.0)
        } else if (outputFormat === 'gif') {
          imgData = canvas.toDataURL('image/gif');
        } else if (outputFormat === 'bmp') {
          imgData = canvas.toDataURL('image/bmp');
        } else if (outputFormat === 'doc') {
          imgData = canvas.toDataURL('image/doc');
        } else {
          throw new Error('Unsupported image format');
        }
  
        const pdf = new jsPDF();
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (imageElement.naturalHeight * imgWidth) / imageElement.naturalWidth;
  
        pdf.addImage(imgData, outputFormat.toUpperCase(), 0, 0, imgWidth, imgHeight);
        pdf.save('image.pdf');
      };
    } catch (error) {
      console.error('Error converting image to PDF:', error);
    }
  };
  
  // Example usage:
  viewImageAsPdf('https://example.com/image.jpg', 'jpeg'); // Convert JPEG image to PDF
  viewImageAsPdf('https://example.com/image.png', 'png'); // Convert PNG image to PDF
  viewImageAsPdf('https://example.com/image.gif', 'gif'); // Convert GIF image to PDF
  viewImageAsPdf('https://example.com/image.bmp', 'bmp'); // Convert BMP image to PDF
  viewImageAsPdf('https://example.com/image.doc', 'doc');
  




  const handleActionClick = async (manuscriptId, action) => {
    switch (action) {
      case 'View':
        handleAction(manuscriptId, 'View');
        break;
      case 'ViewFullManuscript':
        downloadFile(manuscripts.find(m => m.id === manuscriptId).fullPagesUrl);
        break;
      // case 'ViewPictures':
      //   viewPicturesAsPdf(manuscripts.find(m => m.id === manuscriptId).picturesUrl);
      //   break;
      case 'ViewWordDocument':
        downloadFile(manuscripts.find(m => m.id === manuscriptId).firstPageUrl);
        break;
      case 'ViewPDF':
        downloadFile(manuscripts.find(m => m.id === manuscriptId).fullPagesUrl);
        break;
      case 'InviteReviewer':
        handleAction(manuscriptId, 'InviteReviewer');
        break;
      case 'Standardize':
        handleAction(manuscriptId, 'Standardize');
        break;
      default:
        break;
    }
  };



  return (
    <div className="manuscripts-table-container">
      <table className="manuscripts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Institution</th>
            <th>Contact Information</th>
            <th>College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manuscripts.map((manuscript) => (
            <tr key={manuscript.id}>
              <td>{manuscript.id}</td>
              <td>{manuscript.name}</td>
              <td>{manuscript.email}</td>
              <td>{manuscript.institution}</td>
              <td>{manuscript.contactInformation}</td>
              <td>{manuscript.college}</td>
              <td>
                <div className="action-buttons">
                  {/* View Action */}
                  <button className="action-button" onClick={() => handleAction(manuscript.id, 'View')}>
                    <FontAwesomeIcon icon={faHandPointer} />
                  </button>

                  {/* Dropdown with Abstract and other actions */}
                  <div className="action-dropdown">
                    <button onClick={() => fetchAbstract(manuscript.id)}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Abstract
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewFullManuscript')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Manuscript
                    </button>
                    <button onClick={() => viewImageAsPdf(manuscript.id.pictureUrl)}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Image as PDF
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewWordDocument')}>
                      <FontAwesomeIcon icon={faHandPointer} /> Download Word Document
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewPDF')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Manuscript as PDF
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'InviteReviewer')}>
                      <FontAwesomeIcon icon={faPlus} /> Invite Viewer
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'Standardize')}>
                      <FontAwesomeIcon icon={faHandPointer} /> Standardize
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Abstract Popup */}
      {showAbstractPopup && (
        <div className="popup-container">
          <div className="abstract-popup">
            <h3>Abstract</h3>
            <p>{currentAbstract}</p>
            <button onClick={closeAbstractPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedManuscriptsTable;
