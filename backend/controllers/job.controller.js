// E:\pi dev\backend\controllers\job.controller.js
const Job = require('../models/job.model');
const jwt = require("jsonwebtoken");
const Application = require('../models/application.model'); // Adjust the path if necessary

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


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
        const applications = await Application.find({ job: jobId }).populate('user', 'name email'); // Adjust the fields as needed
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





