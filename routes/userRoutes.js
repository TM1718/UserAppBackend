const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Route to store phone number
router.post('/store-number', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const newUser = new User({
            phoneNumber,
        });

        await newUser.save();
        res.status(201).json({ message: 'Phone number stored successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
