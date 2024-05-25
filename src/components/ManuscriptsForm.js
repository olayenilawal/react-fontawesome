import React, { useState } from 'react';
import { firestore, storage } from '../firebase/firebase';
import '../assets/css/manuscriptsform.css';

const ManuscriptsForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [institution, setInstitution] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [residencyStartDate, setResidencyStartDate] = useState('');
  const [part1PassingDate, setPart1PassingDate] = useState('');
  const [expectedExitDate, setExpectedExitDate] = useState('');
  const [part1Evidence, setPart1Evidence] = useState(null);
  const [picture, setPicture] = useState(null);
  const [firstPage, setFirstPage] = useState(null);
  const [fullPages, setFullPages] = useState(null);
  const [references, setReferences] = useState(null);
  const [abstract, setAbstract] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [autoID, setAutoID] = useState('');
  const [showResidencyError, setShowResidencyError] = useState(false);
  const [picturePreview, setPicturePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Function to handle picture file selection
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const validateStep1Data = () => {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      contactInfo.trim() !== '' &&
      addressLine1.trim() !== '' &&
      addressLine2.trim() !== ''
    );
  };

  const validateStep2Data = () => {
    return (
      institution.trim() !== '' &&
      college.trim() !== '' &&
      department.trim() !== '' &&
      specialty.trim() !== '' &&
      residencyStartDate.trim() !== '' &&
      part1Evidence !== null
    );
  };

  const validateStep3Data = () => {
    return (
      picture !== null &&
      firstPage !== null &&
      fullPages !== null &&
      references !== null &&
      abstract.trim() !== ''
    );
  };

  const uploadFileToStorage = async (file) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`manuscripts/${file.name}`);
    await fileRef.put(file);
    return fileRef.getDownloadURL();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading

    try {
      if (step === 1) {
        // Validate Step 1 data
        if (!validateStep1Data()) {
          console.error('Please fill out all required fields.');
          setIsLoading(false); // Stop loading
          return;
        }

        setStep(2); // Proceed to Step 2
      } else if (step === 2) {
        // Validate Step 2 data
        if (!validateStep2Data()) {
          console.error('Please fill out all required fields.');
          setIsLoading(false); // Stop loading
          return;
        }

        // Check residency duration
        const residencyStartDateObj = new Date(residencyStartDate);
        const currentDate = new Date();
        const eighteenMonthsLater = new Date(residencyStartDateObj.setMonth(residencyStartDateObj.getMonth() + 18));
        const expectedExitDateObj = new Date(expectedExitDate);
        if (expectedExitDateObj < eighteenMonthsLater) {
          setShowResidencyError(true);
          console.error('Not eligible. Applicants must have at least 18 months left on their residency training.');
          setIsLoading(false); // Stop loading
          return;
        }

        setStep(3); // Proceed to Step 3
      } else if (step === 3) {
        // Validate Step 3 data
        if (!validateStep3Data()) {
          console.error('Please fill out all required fields.');
          setIsLoading(false); // Stop loading
          return;
        }

        // Upload files to Firebase Storage
        const pictureUrl = await uploadFileToStorage(picture);
        const firstPageUrl = await uploadFileToStorage(firstPage);
        const fullPagesUrl = await uploadFileToStorage(fullPages);
        const referencesUrl = await uploadFileToStorage(references);
        const part1EvidenceUrl = await uploadFileToStorage(part1Evidence);

        // Add manuscript data to Firestore
        const querySnapshot = await firestore.collection('SubmittedManuscripts').get();
        const count = querySnapshot.docs.length + 1;
        const manuscriptID = `LUTHGAM_${new Date().getFullYear().toString().slice(-2)}_${count.toString().padStart(4, '0')}`;

        await firestore.collection('SubmittedManuscripts').add({
          id: manuscriptID,
          name,
          email,
          contactInfo,
          address: `${addressLine1}, ${addressLine2}`,
          institution,
          college,
          department,
          specialty,
          residencyStartDate,
          part1PassingDate,
          expectedExitDate,
          part1EvidenceUrl,
          pictureUrl,
          firstPageUrl,
          fullPagesUrl,
          referencesUrl,
          abstract,
          status: 'Review For Proposal'
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

    setIsLoading(false); // Stop loading
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setContactInfo('');
    setAddressLine1('');
    setAddressLine2('');
    setInstitution('');
    setCollege('');
    setDepartment('');
    setSpecialty('');
    setResidencyStartDate('');
    setPart1PassingDate('');
    setExpectedExitDate('');
    setPart1Evidence(null);
    setPicture(null);
    setFirstPage(null);
    setFullPages(null);
    setReferences(null);
    setAbstract('');
    setStep(1);
    setShowPopup(false);
    setIsSuccess(false);
    setAutoID('');
    setShowResidencyError(false);
  };

  const goBack = () => {
    setStep(step - 1);
    setShowResidencyError(false); // Reset residency error message when going back
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.classList.toggle('move-left', !showPreview); // Toggle the class based on the inverse of showPreview
    }
  };


  return (
    <>


      <div className="form-container">
        <div className="submitted-manuscripts-form">
          <div className="preview-toggle">
            <input type="checkbox" id="previewCheckbox" onChange={togglePreview} />
            <label htmlFor="previewCheckbox">Preview</label>
          </div>
          <h2>{step === 1 ? 'Step 1: Personal Information' : step === 2 ? 'Step 2: Institutional Information' : 'Step 3: Manuscript Information'}</h2>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="Contact Information" required />
                <input type="text" value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Address Line 1"
                  required
                />
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Address Line 2"
                  required
                />
                {/* <button type="button" onClick={goBack}>Previous</button> */}
                <button type="submit">Next</button>
              </>
            )}

            {step === 2 && (
              <>
                <select value={institution} onChange={(e) => setInstitution(e.target.value)} required>
                  <option value="">Select Institution</option>
                  <option value="National postgraduate medical college">National Postgraduate Medical College</option>
                  <option value="West African college pf physician">West African College of Physician</option>
                  <option value="West African college of surgeons">West African College of Surgeons</option>
                </select>

                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="College"
                  required
                />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                  required
                />
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Specialty"
                  required
                />
                <label htmlFor="part1Evidence">Part 1 Passing Evidence</label>
                <input
                  type="file"
                  id="part1Evidence"
                  onChange={(e) => setPart1Evidence(e.target.files[0])}
                  required
                />

                <label htmlFor="residencyStartDate">Residency Start Date</label>
                <input
                  type="date"
                  value={residencyStartDate}
                  onChange={(e) => setResidencyStartDate(e.target.value)}
                  placeholder="Residency Start Date"
                  required
                />

                <label htmlFor="part1PassingDate">Date of Passing Part One</label>
                <input
                  type="date"
                  value={part1PassingDate}
                  onChange={(e) => setPart1PassingDate(e.target.value)}
                  placeholder="Date of Passing Part One"
                  required
                />

                <label htmlFor="expectedExitDate">Expected Date of Exit of Residency</label>
                <input
                  type="date"
                  value={expectedExitDate}
                  onChange={(e) => setExpectedExitDate(e.target.value)}
                  placeholder="Expected Date of Exit of Residency"
                  required
                />

                {showResidencyError && (
                  <div className="residency-error">
                    <p>Not eligible. Applicants must have at least 18 months left on their residency training.</p>
                  </div>
                )}
                <button type="button" onClick={goBack}>Previous</button>
                <button type="submit">Next</button>
              </>
            )}

            {step === 3 && (
              <>
                <label htmlFor="picture">Picture (Passport)</label>
                <input type="file" id="picture" onChange={handlePictureChange} accept="image/*" required />
                {picturePreview && <img src={picturePreview} alt="Uploaded picture preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}

                <label htmlFor="firstPage">Cover Letter</label>
                <input type="file" id="firstPage" onChange={(e) => setFirstPage(e.target.files[0])} required />

                <label htmlFor="fullPages">Manuscript Proper</label>
                <input type="file" id="fullPages" onChange={(e) => setFullPages(e.target.files[0])} required />

                <label htmlFor="references">Reference Details</label>
                <input type="file" id="references" onChange={(e) => setReferences(e.target.files)} multiple required />

                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Abstract (max 250 words)"
                  required
                />

                <button type="button" onClick={goBack}>Previous</button>
                {isLoading ? (
                  <div className="loader">Loading...</div>
                ) : (
                  <button type="submit">Submit</button>
                )}
              </>
            )}
          </form>

        </div>
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

        {/* Error message for residency duration */}
        {showResidencyError && (
          <div className="residency-error">
            <p>Not eligible. Applicants must have at least 18 months left on their residency training.</p>
          </div>
        )}


      </div>
      <div className="preview-container">
        {showPreview && (
          <div className="preview-content">
            <h3>Form Data Preview</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Contact Information:</strong> {contactInfo}</p>
            <p><strong>Address Line 1:</strong> {addressLine1}</p>
            <p><strong>Address Line 2:</strong> {addressLine2}</p>
            <p><strong>Institution:</strong> {institution}</p>
            <p><strong>College:</strong> {college}</p>
            <p><strong>Department:</strong> {department}</p>
            <p><strong>Specialty:</strong> {specialty}</p>
            <p><strong>Residency Start Date:</strong> {residencyStartDate}</p>
            <p><strong>Date of Passing Part One:</strong> {part1PassingDate}</p>
            <p><strong>Expected Date of Exit of Residency:</strong> {expectedExitDate}</p>
            <p><strong>Abstract:</strong> {abstract}</p>
          </div>
        )}
      </div>

    </>
  );
};

export default ManuscriptsForm;

