import React, { useState } from 'react';
import { firestore, storage } from '../firebase/firebase';
import '../assets/css/manuscriptsform.css';

const ManuscriptsForm = () => {
    const [step, setStep] = useState(1); // Step 1: User Information, Step 2: Manuscript Information
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [institution, setInstitution] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [college, setCollege] = useState('');
    const [address, setAddress] = useState('');
    const [picture, setPicture] = useState(null);
    const [firstPage, setFirstPage] = useState(null);
    const [fullPages, setFullPages] = useState(null);
    const [references, setReferences] = useState(null);
    const [abstract, setAbstract] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [autoID, setAutoID] = useState('');
  
    const handleFileUpload = (e, setter) => {
      const selectedFile = e.target.files[0];
      setter(selectedFile);
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          if (step === 1) {
            // Validate Step 1 data
            if (!name || !email || !institution || !contactInfo || !college || !address) {
              console.error('Please fill out all required fields.');
              return;
            }
            setStep(2);
          } else if (step === 2) {
            // Validate Step 2 data
            if (!picture || !firstPage || !fullPages || !references || !abstract) {
              console.error('Please fill out all required fields.');
              return;
            }
      
            const storageRef = storage.ref();
      
            const pictureRef = storageRef.child(`manuscripts/${picture.name}`);
            const firstPageRef = storageRef.child(`manuscripts/${firstPage.name}`);
            const fullPagesRef = storageRef.child(`manuscripts/${fullPages.name}`);
            const referencesRef = storageRef.child(`manuscripts/${references.name}`);
      
            await Promise.all([
              pictureRef.put(picture),
              firstPageRef.put(firstPage),
              fullPagesRef.put(fullPages),
              referencesRef.put(references)
            ]);
      
            const pictureUrl = await pictureRef.getDownloadURL();
            const firstPageUrl = await firstPageRef.getDownloadURL();
            const fullPagesUrl = await fullPagesRef.getDownloadURL();
            const referencesUrl = await referencesRef.getDownloadURL();
      
            // Query Firestore to get the next manuscript ID
            const querySnapshot = await firestore.collection('SubmittedManuscripts').get();
            const count = querySnapshot.docs.length + 1; // Calculate the next ID
      
            // Format the manuscript ID as LUTHMAN_YY_000001
            const manuscriptID = `LUTHMAN_${new Date().getFullYear().toString().slice(-2)}_${count.toString().padStart(6, '0')}`;

            

      
            // Save form data and file URLs to Firestore with the generated ID
            await firestore.collection('SubmittedManuscripts').add({
                id: manuscriptID, // Save the generated ID
                name,
                email,
                institution,
                contactInfo,
                college,
                address,
                pictureUrl,
                firstPageUrl,
                fullPagesUrl,
                referencesUrl,
                abstract
              });


              setAutoID(manuscriptID);
            setIsSuccess(true);
            setShowPopup(true);
          }
        } catch (error) {
          console.error('Error submitting manuscript:', error);
          setShowPopup(true);
          setIsSuccess(false);
        }
      };
      
  
    const resetForm = () => {
      setName('');
      setEmail('');
      setInstitution('');
      setContactInfo('');
      setCollege('');
      setAddress('');
      setPicture(null);
      setFirstPage(null);
      setFullPages(null);
      setReferences(null);
      setAbstract('');
      setStep(1);
      setShowPopup(false);
      setIsSuccess(false);
      setAutoID('');
    };

  return (
    <div className="submitted-manuscripts-form">
      <h2>{step === 1 ? 'Step 1: User Information' : 'Step 2: Manuscript Information'}</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution" required />
            <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Contact Information" required />
            <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College" required />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
          </>
        )}

        {step === 2 && (
          <>
            <label htmlFor="picture">Picture (Passport)</label>
            <input type="file" id="picture" onChange={(e) => handleFileUpload(e, setPicture)} required />

            <label htmlFor="firstPage">First Page</label>
            <input type="file" id="firstPage" onChange={(e) => handleFileUpload(e, setFirstPage)} required />

            <label htmlFor="fullPages">Full Pages</label>
            <input type="file" id="fullPages" onChange={(e) => handleFileUpload(e, setFullPages)} required />

            <label htmlFor="references">References</label>
            <input type="file" id="references" onChange={(e) => handleFileUpload(e, setReferences)} required />

            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Abstract (max 5000 words)"
              required
            />
          </>
        )}

        <button type="submit">{step === 1 ? 'Next' : 'Submit'}</button>
      </form>

       {/* Popup for success or error message */}
       {showPopup && (
      <div className={`popup-container ${isSuccess ? 'success' : 'error'}`}>
      <div className="popup-content">
        <p>{isSuccess ? 'Manuscript Successfully Submitted' : 'Submission Failed. Please try again.'}</p>
        {isSuccess && <p>ID: {autoID}</p>}
        <button onClick={resetForm}>OK</button>
      </div>
    </div>
      )}
    </div>
  );
};

export default ManuscriptsForm;
