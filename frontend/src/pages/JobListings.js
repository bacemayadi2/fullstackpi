import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

function JobListings() {
    const [jobs, setJobs] = useState([]);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await axios.get('http://localhost:3000/api/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        function fetchUserRole() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);  // Decode the JWT token to get user info
                    setUserRole(decodedToken.role);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }
            }
        }

        fetchJobs();
        fetchUserRole();
    }, []);

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:3000/api/jobs/${jobId}`, config);
            setJobs(jobs.filter(job => job._id !== jobId));
            alert('Job deleted successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to delete job');
        }
    };

    return (
        <div className="job-listings" style={styles.container}>
            <h2 style={styles.header}>Available Jobs</h2>
            <ul style={styles.jobList}>
                {jobs.map(job => (
                    <li key={job._id} style={styles.jobListItem}>
                        <div style={styles.jobInfo}>
                            <h3 style={styles.jobTitle}>{job.title}</h3>
                            <p style={styles.jobDetail}><strong>Company:</strong> {job.company}</p>
                            <p style={styles.jobDetail}><strong>Location:</strong> {job.location}</p>
                            <p style={styles.jobDetail}><strong>Type:</strong> {job.type}</p>
                        </div>
                        <div style={styles.jobActions}>
                            {userRole === 'hr' && (
                                <>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        style={styles.deleteButton}
                                        title="Delete this job"
                                    >
                                        X
                                    </button>
                                    <Link
                                        to={`/post-job/${job._id}`}
                                        style={styles.editButton}
                                        title="Edit this job"

                                    >
                                        ✎

                                    </Link>
                                </>
                            )}
                            <Link to={`/job/${job._id}`} style={styles.viewDetailsButton}>View Details</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    },
    jobList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
    },
    jobListItem: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        margin: '10px 0',
        padding: '20px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',  // To position the delete button relative to the item
    },
    jobInfo: {
        flex: '1',
    },
    jobTitle: {
        fontSize: '20px',
        margin: '0 0 10px 0',
        color: '#2c3e50',
    },
    jobDetail: {
        margin: '5px 0',
        fontSize: '16px',
        color: '#7f8c8d',
    },
    jobActions: {
        display: 'flex',
        alignItems: 'center',
    },
    viewDetailsButton: {
        textDecoration: 'none',
        color: '#3498db',
        fontSize: '16px',
        marginLeft: '15px',
        transition: 'color 0.3s ease',
    },
    viewDetailsButtonHover: {
        color: '#2980b9',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '0',
        fontSize: '14px',
        cursor: 'pointer',
        position: 'absolute',
        top: '10px',
        right: '10px',
        height: '25px',
        width: '25px',
        textAlign: 'center',
        lineHeight: '25px',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease',
    },
    deleteButtonHover: {
        backgroundColor: '#c0392b',
    },
    editButton: {
        position: 'absolute',
        top: '0px',
        right: '50px',
        fontSize: '25px', // Increased font size for a bigger icon
        textDecoration: 'none',
        color: '#2ecc71', // Green color
        marginLeft: '10px',
        padding: '5px', // Reduced padding to remove outline effect
        border: 'none', // No border to remove outline
        backgroundColor: 'transparent', // Transparent background
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },

};

export default JobListings;
