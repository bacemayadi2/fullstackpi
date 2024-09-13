require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Middleware to pass Mongoose model to every request
app.use((req, res, next) => {
    req.model = mongoose.model('User'); // Assuming your User model is named 'User'
    next();
});

const authRoutes = require('./routes/auth.route');
const jobRoutes = require('./routes/Job.route');
const userRoutes = require('./routes/user.route');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
