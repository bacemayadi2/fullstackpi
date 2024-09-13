const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applyDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'accepted', 'rejected', 'interview Scheduled'], // Example statuses
        default: 'Pending', // Default value
        required: true
    },
    cv: {
        type: String,
        required: true,
    },
    motivationLetter: {
        type: String,
        required: true,
    },
    interviewDate: {
        type: String, // Use String to store the date in YYYY-MM-DD format
        required: false
    },
    interviewTime: {
        type: String, // Use String to store the time in HH:mm format
        required: false
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
