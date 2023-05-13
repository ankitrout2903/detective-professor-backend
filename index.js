const express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userModel = require('./model/user');
// encrypt password
const bcrypt = require('bcrypt');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ankitrout2903:XaEdtNhT0Zc9udor@cluster0.nhfv4eu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const uuid = uuidv4();

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
// bcrypt the user's password

  try {
    // Create a new user with the provided name, email, password, and uuid
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      uuid,
    });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await user.save();

    // Return a success message as a response
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to register user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let token;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Find the user with the provided email
    const user = await userModel.findOne({ email });

    // If the user doesn't exist or the password is incorrect, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate a JWT
    token = await jwt.sign({ userId: user._id, email: user.email }, 'FLIGHTLIEUTENANTANKITROUTCALLSIGNGUSTYWINGMAN');

    // Return the JWT as a response
    res.json({ token });
  
    // Return a success message as a response
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to login' });
  }
});


// Get user data by email endpoint
app.get('/users/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user with the provided email
    const user = await userModel.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data as a response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve user data' });
  }
});

// Update user data by email endpoint
app.put('/users/:email', async (req, res) => {
  const { email } = req.params;
  const { clue1Time, clue2Time, clue3Time, clue4Time, clue5Time, totalTime, completed } = req.body;

  try {
    // Find the user with the provided email
    const user = await userModel.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's time and completion status
    user.totalTime = totalTime;
    user.clue1Time = clue1Time;
    user.clue2Time = clue2Time;
    user.clue3Time = clue3Time;
    user.clue4Time = clue4Time;
    user.clue5Time = clue5Time;
    user.completed = completed;
    await user.save();

    // Return a success message as a response
    res.json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update user data' });
  }
});

// Get all users endpoint
app.get('/users', async (req, res) => {
  try {
    // Find all users
    const users = await userModel.find();

    // Return the user data as a response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve user data' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
