import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState({});
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token); // Decode the JWT token to get user info
            setUser({
                username: decodedToken.username,
                email: decodedToken.email,
                role: decodedToken.role,
                _id: decodedToken._id,
            });

            // Fetch user details including job applications
            axios.get(`http://localhost:3000/api/users/${decodedToken._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUser(response.data);
                    if (response.data.appliedApplications) {
                        setApplications(response.data.appliedApplications);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the user data!", error);
                });
        }
    }, []);

    const generateICalFile = (interviewDate, interviewTime, jobTitle) => {
        const icalContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:Interview for ${jobTitle}
DESCRIPTION:Interview scheduled for ${jobTitle}
DTSTART:${interviewDate}T${interviewTime}00
DTEND:${interviewDate}T${interviewTime}30
END:VEVENT
END:VCALENDAR
        `;

        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        return url;
    };

    return (
        <div className="profile">
            <h2>User Profile</h2>
            <p>Name: {user.username || 'N/A'}</p>
            <p>Email: {user.email || 'N/A'}</p>
            <p>Role: {user.role || 'N/A'}</p>
            {user.role === 'jobSeeker' && (
                <>
                    <h3>Job Applications:</h3>
                    <ul>
                        {applications.length ? (
                            applications.map(app => (
                                <li key={app._id}>
                                    Job: {app.job?.title || 'Unknown'} at {app.job?.company || 'Unknown'}
                                    <p>Status: {app.status}</p>
                                    {app.status === 'interview Scheduled' && (
                                        <>
                                            <p>Interview Date: {app.interviewDate}</p>
                                            <p>Interview Time: {app.interviewTime}</p>
                                            <a
                                                href={generateICalFile(app.interviewDate, app.interviewTime, app.job?.title || 'Unknown')}
                                                download={`interview-${app.job?.title || 'Unknown'}.ics`}
                                            >
                                                Add to Calendar
                                            </a>
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No job applications</p>
                        )}
                    </ul>
                </>
            )}

        </div>
    );
}

export default Profile;
