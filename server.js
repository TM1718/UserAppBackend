const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const UserRequest = require('./models/UserRequest');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: ['http://localhost:8081', 'http://192.168.122.105:8081'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
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

    res.status(200).json({ success: true, userId: user._id, username: user.username });
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
    res.status(201).json({ success: true, userId: user._id, username: user.username });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/userRequests', async (req, res) => {
  try {
    const {
      userId,
      username,
      goodsName,
      vehicleCount,
      fromDate,
      toDate,
      fromTime,
      toTime,
      company,
    } = req.body;

    const newUserRequest = new UserRequest({
      userId,
      username,
      goodsName,
      vehicleCount,
      fromDate,
      toDate,
      fromTime,
      toTime,
      company,
    });

    await newUserRequest.save();

    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { requests: newUserRequest._id } }
    );

    res.status(201).json({ message: 'User request stored successfully' });
  } catch (error) {
    console.error('Error saving user request:', error);
    res.status(500).json({ message: 'Error saving user request' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
