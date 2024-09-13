import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import JobListings from './pages/JobListings';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import './App.css';  // Import the CSS file
import { jwtDecode } from 'jwt-decode';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = jwtDecode(token);  // Decode the JWT token to get user info
            console.log("jere"+decodedToken);
            setUser({
                username: decodedToken.username,
                role: decodedToken.role,
                email: decodedToken.email
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <Router>
            <header className="menu">
                <nav className="menu-left">
                    <Link to="/">Home</Link>
                    {user && <Link to="/job-listings">Job Listings</Link>}
                    {user && user.role === 'hr' && <Link to="/post-job">Post Job</Link>}

                </nav>
                <div className="menu-right">
                    {user ? (
                        <>
                            <Link to="/profile">Profile</Link>
                            <span>Welcome, {user.username}</span>

                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </header>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/job-listings" element={user ? <JobListings /> : <Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/post-job/:id" element={<PostJob />} />

            </Routes>
        </Router>
    );
}

export default App;
