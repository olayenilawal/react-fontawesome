import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firestore } from '../firebase/firebase';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faChevronLeft, faChevronRight, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/InviteReviewerPage.css';

const InviteReviewerPage = () => {
    const { manuscriptId } = useParams();
    const [manuscriptDetails, setManuscriptDetails] = useState(null);
    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [emailTemplate, setEmailTemplate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchManuscriptDetails = async () => {
            try {
                const manuscriptsRef = firestore.collection('SubmittedManuscripts');
                const querySnapshot = await manuscriptsRef.where('id', '==', manuscriptId).get();

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setManuscriptDetails(doc.data());
                } else {
                    console.log('Manuscript not found for ID:', manuscriptId);
                }
            } catch (error) {
                console.error('Error fetching manuscript details:', error);
            }
        };

        const fetchReviewers = async () => {
            try {
                const reviewersRef = firestore.collection('ManuscriptUsers').where('role', '==', 'Reviewer');
                const querySnapshot = await reviewersRef.get();

                if (!querySnapshot.empty) {
                    const fetchedReviewers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setReviewers(fetchedReviewers);
                } else {
                    console.log('No reviewers found with role "Reviewer".');
                }
            } catch (error) {
                console.error('Error fetching reviewers:', error);
            }
        };

        if (manuscriptId) {
            fetchManuscriptDetails();
        }

        fetchReviewers();
    }, [manuscriptId]);

    // Add reviewer to selected reviewers
    const handleAddReviewer = (reviewer) => {
        const updatedSelectedReviewers = [...selectedReviewers, reviewer];
        setSelectedReviewers(updatedSelectedReviewers);
    };

    // Remove reviewer from selected reviewers
    const handleRemoveReviewer = (reviewerId) => {
        const updatedSelectedReviewers = selectedReviewers.filter((reviewer) => reviewer.id !== reviewerId);
        setSelectedReviewers(updatedSelectedReviewers);
    };

    // Show modal with email template
    const handleShowModal = () => {
        setShowModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const moveManuscriptToReviewing = async (manuscriptData) => {
        try {
            const reviewingManuscriptsRef = firestore.collection('ReviewingManuscripts');
    
            // Check if the manuscript already exists in ReviewingManuscripts
            const querySnapshot = await reviewingManuscriptsRef.where('id', '==', manuscriptData.id).get();
    
            if (!querySnapshot.empty) {
                // Manuscript already exists, update the reviewers only
                const existingDoc = querySnapshot.docs[0];
                const existingData = existingDoc.data();
    
                let existingReviewers = [];
                if (existingData.Reviewer) {
                    if (Array.isArray(existingData.Reviewer)) {
                        existingReviewers = existingData.Reviewer;
                    } else {
                        existingReviewers = [existingData.Reviewer];
                    }
                }
    
                const newReviewers = [...selectedReviewers, ...existingReviewers];
    
                await existingDoc.ref.update({
                    Reviewer: newReviewers
                });
    
                console.log('Manuscript updated in ReviewingManuscripts collection with new reviewers.');
            } else {
                // Manuscript does not exist, add it to ReviewingManuscripts
                const newReviewingManuscriptRef = await reviewingManuscriptsRef.add({
                    ...manuscriptData,
                    Reviewer: selectedReviewers
                });
    
                console.log('Manuscript moved to ReviewingManuscripts collection successfully.');
            }
        } catch (error) {
            console.error('Error moving manuscript to ReviewingManuscripts collection:', error);
        }
    };
    
    
    const handleSendEmail = async () => {
        if (!manuscriptDetails) {
            console.error('Manuscript details not available.');
            return;
        }

        const reviewerNames = selectedReviewers.map((reviewer) => reviewer.name).join(', ');
        const subject = `Invitation to Review Manuscript: ${manuscriptDetails.name}`;
        const initialMessage = `Dear Reviewer,\n\nI hope this email meets you well. You have been invited to review the manuscript "${manuscriptDetails.name}".\n\n`;

        const mailTemplate = `${initialMessage}Please use the following link to login and view the manuscript:\n\n[Insert Link Here]\n\nThank you!\n\nSincerely,\n[Your Name]`;

        setEmailTemplate(mailTemplate);
        handleShowModal(); // Show the modal with the email template

        // Move manuscript to ReviewingManuscripts collection
        await moveManuscriptToReviewing(manuscriptDetails);
    };

    // Search for reviewers based on input query
    const filteredReviewers = reviewers.filter((reviewer) =>
        (reviewer.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (reviewer.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );


    // Function to handle inviting external reviewer via mail
    const handleInviteExternalReviewer = () => {
        // Implement functionality to invite external reviewer via mail
        console.log('Inviting external reviewer via mail...');
    };

    // Function to switch manuscript
    const handleSwitchManuscript = () => {
        // Implement functionality to switch manuscript
        console.log('Switching manuscript...');
    };

    if (!manuscriptDetails) {
        return <div>Loading...</div>;
    }

    // Pagination functionality
    const itemsPerPage = 10;
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const paginatedReviewers = filteredReviewers.slice(firstIndex, lastIndex);

    const handleNextPage = () => {
        if (lastIndex < filteredReviewers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="invite-reviewer-container">
            <div className="header">
                <h1>Invite Reviewer Dashboard</h1>
                <div className="container">
                    <div className="button-container">
                        < FontAwesomeIcon icon={faHome} className="home-icon" />
                        <Button className="button button-primary">Invite External</Button>
                        <Button className="button button-secondary">Switch Manuscript</Button>
                    </div>

                </div>

            </div>
            <h2>Manuscript ID: {manuscriptId}</h2>
            <div className="manuscript-details">
                <h3>Manuscript Details:</h3>
                <p>Name: {manuscriptDetails.name}</p>
                <p>Email: {manuscriptDetails.email}</p>
                <p>Institution: {manuscriptDetails.institution}</p>
            </div>
            {/* <div className="search-container">
                        <input type="text" className="search-input" placeholder="Search..." />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div> */}

            <div className="search-input-container">
                <InputGroup className="search-input">
                    <FormControl
                        placeholder="Search reviewers..."
                        aria-label="Search reviewers"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                        <FontAwesomeIcon icon={faSearch} />
                    
                </InputGroup>
            </div>

            <div className="reviewers-list">
                <h3>Reviewers:</h3>
                <Table striped bordered hover className="reviewers-table">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Add/Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedReviewers.map((reviewer) => (
                            <tr key={reviewer.id}>
                                <td>{reviewer.name}</td>
                                <td>{reviewer.email}</td>
                                <td>
                                    <Button className="add-button" variant="success" onClick={() => handleAddReviewer(reviewer)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                    <Button className="add-button" variant="danger" onClick={() => handleRemoveReviewer(reviewer.id)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="button-group">
                    <Button
                        className="primary"
                        variant="primary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} /> {/* Previous Icon */}
                    </Button>
                    <Button
                        className="primary"
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={lastIndex >= filteredReviewers.length}
                    >
                        <FontAwesomeIcon icon={faChevronRight} /> {/* Next Icon */}
                    </Button>
                    <Button className="primary add-buttons" variant="primary" onClick={handleSendEmail}>
                        Add ({selectedReviewers.length})
                    </Button>
                </div>
            </div>

            {/* Modal component */}
            {showModal && (
                <div className="invite-reviewer-modal">
                    <Modal.Dialog className="modal-content">
                        <Modal.Header closeButton>
                            <Modal.Title>Invite Reviewer</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {/* Display selected reviewers with close buttons */}
                            {selectedReviewers.map((reviewer) => (
                                <div key={reviewer.id} className="selected-reviewer">
                                    {reviewer.name}
                                    <Button variant="link" onClick={() => handleRemoveReviewer(reviewer.id)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </div>
                            ))}

                            {/* Email template textarea */}
                            <Form.Group controlId="emailTemplate">
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    value={emailTemplate}
                                    onChange={(e) => setEmailTemplate(e.target.value)}
                                    placeholder="Compose your email..."
                                />
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSendEmail}>
                                Send
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            )}
        </div>
    );
};

export default InviteReviewerPage;
