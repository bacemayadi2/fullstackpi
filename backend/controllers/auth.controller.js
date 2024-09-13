// backend/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        // Create new user
        const newUser = {
            username,
            email,
            password: password,
            role
        };
        console.log(newUser);


        // Save user to database
        const savedUser = await User.create(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received login request:', { email, password });

        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const hashedPassword= user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        console.log('Password comparison result:', isValidPassword);
        console.log('Direct comparison:', await bcrypt.compare(password, user.password));

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id, username : user.username ,email:user.email,  role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('JWT token generated');

        res.json({ token });
    } catch (error) {
        console.error('Error in login controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
