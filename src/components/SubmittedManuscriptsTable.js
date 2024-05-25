import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faPlus } from '@fortawesome/free-solid-svg-icons';
import { firestore, storage } from '../firebase/firebase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const SubmittedManuscriptsTable = ({ manuscripts, handleAction }) => {
  const [showAbstractPopup, setShowAbstractPopup] = useState(false);
  const [currentAbstract, setCurrentAbstract] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = manuscripts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(manuscripts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchAbstract = async (manuscriptId) => {
    try {
      const manuscriptRef = firestore.collection('SubmittedManuscripts').where('ID', '==', manuscriptId);
      const querySnapshot = await manuscriptRef.get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
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
          imgData = canvas.toDataURL('image/jpeg', 1.0);
        } else if (outputFormat === 'gif') {
          imgData = canvas.toDataURL('image/gif');
        } else if (outputFormat === 'bmp') {
          imgData = canvas.toDataURL('image/bmp');
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

  const handleActionClick = async (manuscriptId, action) => {
    switch (action) {
      case 'View':
        handleAction(manuscriptId, 'View');
        break;
      case 'ViewFullManuscript':
        downloadFile(manuscripts.find((m) => m.id === manuscriptId).fullPagesUrl);
        break;
      case 'ViewPictures':
        viewImageAsPdf(manuscripts.find((m) => m.id === manuscriptId).picturesUrl);
        break;
      case 'ViewWordDocument':
        downloadFile(manuscripts.find((m) => m.id === manuscriptId).firstPageUrl);
        break;
      case 'ViewPDF':
        downloadFile(manuscripts.find((m) => m.id === manuscriptId).fullPagesUrl);
        break;
      case 'InviteReviewer':
        navigateToInviteReviewer(manuscriptId);
        break;
      case 'InviteMembers':
        navigateToInviteMembers(manuscriptId);
        break;
      case 'Standardize':
        handleAction(manuscriptId, 'Standardize');
        break;
      default:
        break;
    }
  };

  const navigateToInviteReviewer = (manuscriptId) => {
    navigate(`/manage-reviewers/${manuscriptId}`);
  };

  const navigateToInviteMembers = (manuscriptId) => {
    navigate(`/manage-members/${manuscriptId}`);
  };

  return (
    <div className="manuscripts-table-container">
      <table className="manuscripts-table">
        
        <thead>
          <tr>
            <th>S/N</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Institution</th>
            <th>Contact Information</th>
            <th>College</th>
            <th>Status</th>
            <th className='actions'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((manuscript, index) => (
            <tr key={manuscript.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{manuscript.id}</td>
              <td>{manuscript.name}</td>
              <td>{manuscript.email}</td>
              <td>{manuscript.institution}</td>
              <td>{manuscript.contactInfo}</td>
              <td>{manuscript.college}</td>
              <td>{manuscript.status}</td> {/* Display status based on manuscript ID */}
              <td className='actions'>
                <div className="action-buttons">
                  <button className="action-button" onClick={() => handleAction(manuscript.id, 'View')}>
                    <FontAwesomeIcon icon={faHandPointer} />
                  </button>
                  <div className="action-dropdown">
                    <button onClick={() => fetchAbstract(manuscript.id)}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Abstract
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewFullManuscript')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Manuscript
                    </button>
                    <button onClick={() => viewImageAsPdf(manuscript.id, 'ViewPDF')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Image as PDF
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewWordDocument')}>
                      <FontAwesomeIcon icon={faHandPointer} /> Download Word Document
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'ViewPDF')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Manuscript as PDF
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'InviteReviewer')}>
                      <FontAwesomeIcon icon={faPlus} /> Invite Reviewer
                    </button>
                    <button onClick={() => handleActionClick(manuscript.id, 'InviteMembers')}>
                      <FontAwesomeIcon icon={faPlus} /> Invite Members
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
        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          ))}
        </div>
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
