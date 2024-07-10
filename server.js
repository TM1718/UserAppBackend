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
    console.log('Companies:', companies);
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

    await Company.findOneAndUpdate(
      { name: company },
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

    const userRequests = await UserRequest.find({ userId });
    res.status(200).json(userRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Error fetching user requests' });
  }
});

app.delete('/api/userRequests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await UserRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Remove request ID from associated user and company
    await User.findOneAndUpdate(
      { _id: deletedRequest.userId },
      { $pull: { requests: deletedRequest._id } }
    );

    await Company.findOneAndUpdate(
      { name: deletedRequest.company },
      { $pull: { requests: deletedRequest._id } }
    );

    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ success: false, message: 'Failed to delete record' });
  }
});

// Update a user request by ID
app.put('/api/userRequests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const {
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

    // Update the user request
    const updatedRequest = await UserRequest.findByIdAndUpdate(
      id,
      {
        goodsName,
        vehicleCount,
        fromDate,
        toDate,
        fromTime,
        toTime,
        company,
        fromPlace,
        toPlace,
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.status(200).json({ success: true, message: 'Record updated successfully', updatedRequest });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ success: false, message: 'Failed to update record' });
  }
});


app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, phoneNumber } = user;
    res.status(200).json({ username, phoneNumber });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
