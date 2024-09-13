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
    cv: {
        type: String,
        required: true,
    },
    motivationLetter: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
