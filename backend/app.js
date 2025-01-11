const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const DailyPuzzle = require('./models/DailyPuzzle');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const redis = require('redis');

require('dotenv').config();

const app = express();

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const port = 3000;

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

const generateAccessToken = (user) => {
  return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Access Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Access Token' });
    req.user = user;
    next();
  });
};

app.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username });
    res.status(200).json({ exists: !!existingUser });
  } catch (err) {
    res.status(500).json({ message: 'Error searching for username', error: err });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

app.post('/add-ranking', authenticateToken, async(req, res) => {
  // Get the user and what was the time he completed
  // save on the ranking table
});

app.get('/fetch-ranking', authenticateToken, async(req, res) => {
  // Get all the ranks for today
});

app.post('/update-highscore', authenticateToken, async (req, res) => {
  const { highscore } = req.body;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (highscore < user.highscore) {
      user.highscore = highscore;
      await user.save();
      redisClient.setex(username, 3600, JSON.stringify({ highscore: user.highscore }));
      return res.status(200).json({ message: 'High score updated successfully', highscore: user.highscore });
    } else {
      return res.status(200).json({ message: 'Current high score is higher or equal', highscore: user.highscore });
    }
  } catch (err) {
    console.error('Error updating high score:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.get('/get-userinfo', async (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(400).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    if (username) {
      redisClient.get(username, async (err, data) => {
        if (err) throw err;

        if (data) {
          return res.status(200).json(JSON.parse(data));
        } else {
          const user = await User.findOne({ username });
          if (user) {
            const highscore = user.highscore;
            redisClient.setex(username, 3600, JSON.stringify({ username, highscore }));
            return res.status(200).json({ username, highscore });
          } else {
            return res.status(404).json({ message: 'User not found in the database' });
          }
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid token' });
    }
  } catch (err) {
    console.error('Error verifying token or fetching user:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
    });

  } catch (err) {
    res.status(500).json({ message: 'Error logging in', err });
  }
});

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token missing' });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Refresh Token' });

    const newAccessToken = generateAccessToken(user);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: 'Access Token refreshed' });
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

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

app.post('/create-daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
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
