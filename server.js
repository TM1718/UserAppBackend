const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(bodyParser.json());

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:8081', 'http://192.168.122.105:8081'], // Allow requests from these origins
  methods: ['GET', 'POST'], // Allow GET and POST requests
  allowedHeaders: ['Content-Type'], // Allow only Content-Type header
};

app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/Testing27', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/api/users/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


app.post('/api/users/register', async (req, res) => {
  const { username, phoneNumber, password } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      phoneNumber,
      password,
    });

    await user.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
