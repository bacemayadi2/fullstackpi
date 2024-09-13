import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Use to get params and navigate

function PostJob() {
    const { id } = useParams(); // Get job ID from URL params, if available
    const navigate = useNavigate(); // Hook for navigation
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [salary, setSalary] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');


    useEffect(() => {
        if (id) {
            // Fetch job details if editing
            async function fetchJob() {
                try {
                    const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
                    const job = response.data;
                    setTitle(job.title);
                    setDescription(job.description);
                    setCompany(job.company);
                    setLocation(job.location);
                    setType(job.type);
                    setSalary(job.salary);
                    setSkillsRequired(job.skillsRequired.join(','));
                } catch (error) {
                    console.error('Error fetching job details:', error);
                }
            }

            fetchJob();
        }
    }, [id]);

    const fetchCompanySuggestions = async (query) => {
        if (query.length < 3) {
            setCompanySuggestions([]);
            return;
        }

        try {
            const response = await axios.get('https://autocomplete.clearbit.com/v1/companies/suggest', {
                params: { query }
            });
            setCompanySuggestions(response.data);
        } catch (error) {
            console.error('Error fetching company suggestions:', error);
        }
    };

    const fetchLocationSuggestions = async (query) => {
        if (query.length < 3) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1
                }
            });
            setLocationSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
    };

    const handleCompanyChange = (e) => {
        const value = e.target.value;
        setCompany(value);
        fetchCompanySuggestions(value);
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        fetchLocationSuggestions(value);
    };

    const handleSuggestionClick = (suggestion, type) => {
        if (type === 'company') {
            setSelectedCompany(suggestion.name);
            setCompany(suggestion.name);
            setCompanySuggestions([]);
        } else if (type === 'location') {
            setSelectedLocation(suggestion.display_name);
            setLocation(suggestion.display_name);
            setLocationSuggestions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (id) {
                // Update existing job
                await axios.patch(`http://localhost:3000/api/jobs/${id}`, {
                    title,
                    description,
                    company,
                    location,
                    type,
                    salary: Number(salary),
                    skillsRequired: skillsRequired.split(',')
                }, config);
                alert('Job updated successfully');
            } else {
                // Create new job
                await axios.post('http://localhost:3000/api/jobs', {
                    title,
                    description,
                    company,
                    location,
                    type,
                    salary: Number(salary),
                    skillsRequired: skillsRequired.split(',')
                }, config);
                alert('Job posted successfully');
            }
            navigate('/job-listings'); // Redirect after successful operation
        } catch (error) {
            console.error(error);
            alert('Failed to post/update job');
        }
    };

    return (
        <div className="post-job-container">
            <h2>{id ? 'Edit Job' : 'Post a New Job'}</h2>
            <form className="post-job-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter job title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Job Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter job description"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                        id="company"
                        type="text"
                        value={company}
                        onChange={handleCompanyChange}
                        placeholder="Enter company name"
                        required
                    />
                    {companySuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {companySuggestions.map((suggestion) => (
                                <li
                                    key={suggestion.domain}
                                    onClick={() => handleSuggestionClick(suggestion, 'company')}
                                    className="suggestion-item"
                                >
                                    <img src={suggestion.logo} alt={suggestion.name} width="24" height="24" />
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        placeholder="Enter job location"
                        required
                    />
                    {locationSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {locationSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion.place_id}
                                    onClick={() => handleSuggestionClick(suggestion, 'location')}
                                    className="suggestion-item"
                                >
                                    {suggestion.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="type">Job Type</label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="">Select Job Type</option>
                        <option value="full-time">Full-time</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills Required</label>
                    <input
                        id="skills"
                        type="text"
                        value={skillsRequired}
                        onChange={(e) => setSkillsRequired(e.target.value)}
                        placeholder="Enter skills required (comma-separated)"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salary">Salary (in TND)</label>
                    <input
                        id="salary"
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="Enter salary amount"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">{id ? 'Update Job' : 'Post Job'}</button>
            </form>
        </div>
    );
}

export default PostJob;
