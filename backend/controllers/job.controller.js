// E:\pi dev\backend\controllers\job.controller.js
const Job = require('../models/job.model');
const jwt = require("jsonwebtoken");
const Application = require('../models/application.model'); // Adjust the path if necessary
const User = require('../models/user.model'); // Adjust the path as necessary

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Accept a specific application
exports.acceptApplication = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const application = await Application.findById(applicationId).populate('user');

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update the application status to 'accepted'
        application.status = 'accepted';
        await application.save();

        res.json({ message: 'Application accepted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Schedule an interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { applicationId, interviewDate, interviewTime } = req.body;
        const application = await Application.findById(applicationId).populate('user');

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update the application status and interview details
        application.status = 'interview Scheduled';
        application.interviewDate = interviewDate; // Store the interview date
        application.interviewTime = interviewTime; // Store the interview time
        await application.save();

        res.json({ message: 'Interview scheduled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const jobId = req.params.id; // Extract job ID from URL
        const { cv, motivationLetter } = req.files; // Assuming you're using multer for file uploads
        const userId = req.user._id; // Assuming user ID is set in req.user by auth middleware

        const application = new Application({
            user: userId,
            job: jobId,
            cv: cv[0].path, // Adjust based on multer's structure
            motivationLetter: motivationLetter[0].path,
            applyDate: new Date(),
        });

        await application.save();

        const user = await User.findById(userId);
        if (user) {
            user.appliedApplications.push(application._id); // Update reference to applications
            await user.save();
        }

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Application submission failed' });
    }
};

exports.postJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token); // Log the token for debugging
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decodedToken); // Log decoded token to verify role

        if (decodedToken.role !== 'hr') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const job = await Job.findByIdAndDelete(req.params.id);
        console.log('Deleted Job:', job); // Log the result of the deletion

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error:', error); // Detailed logging
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getApplicationsForJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        // Populate both the user (with username and email) and the job (with title)
        const applications = await Application.find({ job: jobId })
            .populate('user', 'username email') // populate username and email from the user
            .populate('job', 'title'); // populate title from the job

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// E:\pi dev\backend\controllers\job.controller.js
exports.modifyJob = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the user is an HR role
        if (decodedToken.role !== 'hr') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const jobId = req.params.id;
        const updatedData = req.body;

        // Find and update the job with new data
        const updatedJob = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(updatedJob);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





