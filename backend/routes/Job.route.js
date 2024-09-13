const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware'); // Add the upload middleware

const jobController = require('../controllers/job.controller');

router.get('/', jobController.getJobs); // GET /jobs
router.post('/', jobController.postJob); // POST /jobs
router.get('/:id', jobController.getJobById); // GET /jobs/:id
router.delete('/:id', jobController.deleteJob);
router.post('/:id/apply', authMiddleware.authenticateToken, uploadMiddleware, jobController.applyForJob); // Apply for job with CV & motivation letter
router.get('/:id/applications', jobController.getApplicationsForJob);
router.patch('/:id', jobController.modifyJob);
router.post('/applications/:applicationId/accept', jobController.acceptApplication);
router.post('/applications/schedule-interview', jobController.scheduleInterview);
module.exports = router;
