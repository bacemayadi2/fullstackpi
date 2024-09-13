import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Profile() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token); // Decode the JWT token to get user info
            setUser({
                username: decodedToken.username,
                email: decodedToken.email,
                role: decodedToken.role,
                // Add additional fields if necessary
            });
        }
    }, []);

    return (
        <div className="profile">
            <h2>User Profile</h2>
            <p>Name: {user.username || 'N/A'}</p>
            <p>Email: {user.email || 'N/A'}</p>
            <p>Role: {user.role || 'N/A'}</p>
            {user.role === 'jobSeeker' && (
                <>
                    <p>Resume: {user.profile?.resume || 'Not uploaded'}</p>
                    <p>Contact Details: {user.profile?.contactDetails || 'Not provided'}</p>
                </>
            )}
            {user.role === 'hr' && (
                <>
                    <p>Company: {user.profile?.company || 'Not provided'}</p>
                    <p>Contact Details: {user.profile?.contactDetails || 'Not provided'}</p>
                </>
            )}
        </div>
    );
}

export default Profile;
