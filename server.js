const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User'); // Assuming User model definition
const UserRequest = require('./models/UserRequest'); // Assuming UserRequest model definition
const Company = require('./models/Company'); // Assuming Company model definition

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: ['http://localhost:8081', 'http://192.168.122.105:8081', 'http://10.0.10.181.105:8081'],
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

    res.status(201).json({ success: true, userId: user._id, username: user.username, phoneNumber: user.phoneNumber });
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
    res.status(201).json({ success: true, userId: user._id, username: user.username, phoneNumber: user.phoneNumber });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Fetch all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    console.log('Companies:', companies); // Debugging line
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

app.post('/api/userRequests', async (req, res) => {
  try {
    const {
      userId,
      username,
      phoneNumber,
      goodsName,
      vehicleCount,
      fromDate,
      toDate,
      fromTime,
      toTime,
      company,
      fromPlace,
      toPlace,
    } = req.body;

    const newUserRequest = new UserRequest({
      userId,
      username,
      phoneNumber,
      goodsName,
      vehicleCount,
      fromDate,
      toDate,
      fromTime,
      toTime,
      company,
      fromPlace,
      toPlace,
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

app.get('/api/userRequests', async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId).populate('requests');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Error fetching user requests' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
