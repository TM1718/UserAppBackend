const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(bodyParser.json());

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:8081', 'http://192.168.122.105:8081'], // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow GET and POST requests
  allowedHeaders: ['Content-Type'], // Allow only Content-Type header
};

app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/Testing27', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/api/users', async (req, res) => {
  const { phoneNumber, password } = req.body;
  
  try {
    let user = await User.findOne({ phoneNumber });

    if (user) {
      if (user.password === password) {
        return res.status(200).send({ message: 'User authenticated, navigate to home screen', navigate: 'HomeScreen' });
      } else {
        return res.status(401).send({ message: 'Invalid password' });
      }
    } else {
      const newUser = new User({ phoneNumber, password });
      await newUser.save();
      return res.status(201).send({ message: 'User created, navigate to EnterUsername', navigate: 'EnterUsername' });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
