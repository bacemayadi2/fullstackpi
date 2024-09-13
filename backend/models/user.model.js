// E:\pi dev\backend\models\User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }] // Store the jobs the user applied for
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
