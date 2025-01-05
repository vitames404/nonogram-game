const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const DailyPuzzle = require('./models/DailyPuzzle');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend's address
  credentials: true, // Allow credentials if needed
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const port = 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Route to get users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Route to check if the entered username already exists
app.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    res.status(200).json({ exists: !!existingUser });
  } catch (err) {
    res.status(500).json({ message: 'Error searching for username', error: err });
  }
});

// Route to register the new user
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Route to login the user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

//-------------------------------------------------------------------------

// Routes for the daily challenge creation

// Utility Functions
const createGrid = (size) => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (Math.random() < 0.5 ? 0 : 1))
  );
};

const calculateHints = (grid) => {
  const calculateLineHints = (line) => {
    const hints = [];
    let count = 0;

    for (const cell of line) {
      if (cell === 1) {
        count += 1;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }

    if (count > 0) {
      hints.push(count);
    }

    return hints.length > 0 ? hints : [0];
  };

  const rowHints = grid.map((row) => calculateLineHints(row));
  const colHints = grid[0].map((_, colIndex) =>
    calculateLineHints(grid.map((row) => row[colIndex]))
  );

  return { rowHints, colHints };
};

// Route to Create a Daily Challenge
app.post('/create-daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existingPuzzle = await DailyPuzzle.findOne({ date: today });

    if (existingPuzzle) {
      return res
        .status(400)
        .json({ message: 'Daily challenge for today already exists' });
    }

    const gridSize = 5;
    const grid = createGrid(gridSize);
    const { rowHints, colHints } = calculateHints(grid);

    const newPuzzle = new DailyPuzzle({
      grid,
      rowHints,
      colHints,
      date: today,
    });

    await newPuzzle.save();

    res.status(201).json({
      message: 'Daily challenge created successfully',
      puzzle: newPuzzle,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating daily challenge',
      error: err.message,
    });
  }
});

// Route to Fetch the Daily Challenge
app.get('/get-daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dailyPuzzle = await DailyPuzzle.findOne({ date: today });

    if (!dailyPuzzle) {
      return res.status(404).json({
        message: 'No daily challenge found for today',
      });
    }

    res.status(200).json({ puzzle: dailyPuzzle });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching daily challenge',
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});