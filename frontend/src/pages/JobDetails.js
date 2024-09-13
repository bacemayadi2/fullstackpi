import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import from jwt-decode

function JobDetails() {
    const [job, setJob] = useState({});
    const [userRole, setUserRole] = useState(null);
    const [convertedSalary, setConvertedSalary] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('TND');
    const [cvFile, setCvFile] = useState(null);
    const [motivationLetter, setMotivationLetter] = useState(null);
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [expandedApplicationId, setExpandedApplicationId] = useState(null);

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/jobs/${id}/applications`);
            setApplications(response.data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    useEffect(() => {
        if (userRole === 'hr') {
            fetchApplications();
        }
    }, [userRole]);

    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
                setJob(response.data);

                if (response.data.salary) {
                    await convertSalary(response.data.salary, selectedCurrency);
                }
            } catch (error) {
                console.error(error);
            }
        }

        function fetchUserRole() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.role);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }
            }
        }

        fetchJob();
        fetchUserRole();
    }, [id, selectedCurrency]);

    const convertSalary = async (salary, targetCurrency) => {
        if (targetCurrency === 'TND') {
            setConvertedSalary(salary);
            return;
        }
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/TND`);
            const rate = response.data.rates[targetCurrency];
            if (rate) {
                setConvertedSalary((Number(salary) * rate).toFixed(2));
            } else {
                setConvertedSalary(null);
            }
        } catch (error) {
            console.error('Currency conversion failed:', error);
            setConvertedSalary(null);
        }
    };

    const handleCurrencyChange = (e) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);
        convertSalary(job.salary, newCurrency);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` }};
            await axios.delete(`http://localhost:3000/api/jobs/${id}`, config);
            alert('Job deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to delete job');
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.name === "cv") {
            setCvFile(e.target.files[0]);
        } else if (e.target.name === "motivationLetter") {
            setMotivationLetter(e.target.files[0]);
        }
    };

    const handleApply = async () => {
        const formData = new FormData();
        formData.append('cv', cvFile);
        formData.append('motivationLetter', motivationLetter);
        formData.append('jobId', id);
        formData.append('applyDate', new Date());

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.post(`http://localhost:3000/api/jobs/${id}/apply`, formData, config);
            alert('Application submitted successfully');
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert('Application submission failed');
        }
    };

    const toggleExpand = (applicationId) => {
        setExpandedApplicationId(expandedApplicationId === applicationId ? null : applicationId);
    };

    return (
        <div className="job-details" style={styles.container}>

            <div style={styles.header}>
                <h1 style={styles.title}>{job.title || 'Job Title Not Available'}</h1>
            </div>
            <p style={styles.text}><strong>Company:</strong> {job.company || 'Company Not Available'}</p>
            <p style={styles.text}><strong>Location:</strong> {job.location || 'Location Not Available'}</p>
            <p style={styles.text}><strong>Type:</strong> {job.type || 'Job Type Not Available'}</p>
            <div style={styles.salaryContainer}>
                <p style={styles.text}><strong>Salary:</strong> {selectedCurrency === 'TND' ? `${job.salary} TND` : `${convertedSalary} ${selectedCurrency}`}</p>
                <div style={styles.currencySelector}>
                    <select id="currency" value={selectedCurrency} onChange={handleCurrencyChange} style={styles.select}>
                        <option value="TND">TND</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
            </div>
            <p style={styles.text}><strong>Description:</strong> {job.description || 'Description Not Available'}</p>
            <p style={styles.text}><strong>Skills Required:</strong> {job.skillsRequired ? job.skillsRequired.join(', ') : 'No skills required'}</p>
            {userRole === 'jobSeeker' && (
                <div>
                    <input type="file" name="cv" onChange={handleFileUpload} accept=".pdf" style={styles.fileInput} />
                    <input type="file" name="motivationLetter" onChange={handleFileUpload} accept=".pdf" style={styles.fileInput} />
                    <button style={styles.applyButton} onClick={handleApply}>Apply Now</button>
                </div>
            )}

            {userRole === 'hr' && (
                <>
                    <div>
                        <h2>Applications</h2>
                        <ul>
                            {applications.map((application) => (
                                <li key={application._id}>
                                    <p onClick={() => toggleExpand(application._id)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        {application.user.email}
                                    </p>
                                    {expandedApplicationId === application._id && (
                                        <div style={styles.details}>
                                            <p><strong>User:</strong> {application.user.name} ({application.user.email})</p>
                                            <p><strong>CV:</strong> <a href={`http://localhost:3000/${application.cv}`} target="_blank" rel="noopener noreferrer">View CV</a></p>
                                            <p><strong>Motivation Letter:</strong> <a href={`http://localhost:3000/${application.motivationLetter}`} target="_blank" rel="noopener noreferrer">View Motivation Letter</a></p>
                                            <p><strong>Applied on:</strong> {new Date(application.applyDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '700px',
        margin: '50px auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        position: 'relative',  // To position the delete button relative to the container
    },
    header: {
        marginBottom: '20px',
    },
    title: {
        fontSize: '30px',
        fontWeight: '600',
        margin: '0',
        color: '#333',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        position: 'absolute',
        top: '15px',
        right: '15px',  // Positions the button at the top-right corner
        borderRadius: '50%',
        transition: 'background-color 0.3s ease',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonHover: {
        backgroundColor: '#c0392b',
    },
    text: {
        fontSize: '18px',
        color: '#555',
        marginBottom: '15px',
    },
    applyButton: {
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'background-color 0.3s ease',
    },
    applyButtonHover: {
        backgroundColor: '#2980b9',
    },
    salaryContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    currencySelector: {
        marginLeft: '10px',
    },
    label: {
        fontSize: '18px',
        color: '#555',
    },
    select: {
        padding: '8px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        cursor: 'pointer',
        backgroundColor: '#f8f8f8',
        transition: 'border-color 0.3s ease',
    },
    details: {
        marginTop: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    },
};

export default JobDetails;
