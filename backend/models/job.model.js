// E:\pi dev\backend\models\Job.js
const mongoose = require('mongoose');
const jobApplicationSchema = require("./application.model");

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    type: String,
    description: String,
    skillsRequired: Array,
    salary: Number, // Added salary field
    createdAt: { type: Date, default: Date.now },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]  // Reference Application model

});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
