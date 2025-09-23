# IELTS Prep Tracker - Backend Copilot Instructions

## Project Overview

Build a secure backend API for the IELTS Prep Tracker application using Node.js, Express, and MongoDB. The backend will handle user authentication, progress tracking, and study session management following the established MERN structure patterns.

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Security**: CORS, cookie-parser, environment variables

## Project Structure

```
/server
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   └── progressController.js # Progress tracking
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation
├── models/
│   ├── User.js              # User schema
│   └── Progress.js          # Progress tracking schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   └── progress.js          # Progress routes
├── utils/
│   ├── validation.js        # Validation functions
│   └── constants.js         # Application constants
└── app.js                   # Main application file
```

## Database Schema Design

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add getJWT method
userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Add validatePassword method
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

### Progress Schema

```javascript
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
      enum: ["listening", "reading", "writing", "speaking"],
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    startTime: Date,
    endTime: Date,
    totalDuration: Number, // in minutes
    sessions: [
      {
        start: Date,
        end: Date,
        duration: Number, // in minutes
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
progressSchema.index({ userId: 1, taskId: 1 }, { unique: true });
```

## API Endpoints

### Authentication Routes (`/`)

| Method | Endpoint    | Description         | Auth Required |
| ------ | ----------- | ------------------- | ------------- |
| POST   | `/register` | Register a new user | No            |
| POST   | `/login`    | Login user          | No            |
| POST   | `/logout`   | Logout user         | Yes           |

### User Routes (`/users`)

| Method | Endpoint   | Description              | Auth Required |
| ------ | ---------- | ------------------------ | ------------- |
| GET    | `/profile` | Get current user profile | Yes           |
| PATCH  | `/profile` | Update user profile      | Yes           |

### Progress Routes (`/progress`)

| Method | Endpoint            | Description                      | Auth Required |
| ------ | ------------------- | -------------------------------- | ------------- |
| GET    | `/`                 | Get all user progress            | Yes           |
| GET    | `/:module`          | Get progress for specific module | Yes           |
| POST   | `/:taskId/start`    | Start a study session            | Yes           |
| PATCH  | `/:taskId/pause`    | Pause a study session            | Yes           |
| PATCH  | `/:taskId/complete` | Complete a study session         | Yes           |

## Implementation Code Structure

### Main Application File (`app.js`)

```javascript
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

// Use routes
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/progress", progressRouter);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
```

### Database Configuration (`config/database.js`)

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = connectDB;
```

### Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login to access this resource");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

module.exports = userAuth;
```

### Auth Controller (`controllers/authController.js`)

```javascript
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");

exports.register = async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists with this email");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
};

exports.login = async (req, res) => {
  try {
    validateLoginData(req);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.send("Logout successful");
  } catch (err) {
    res.status(400).send("Error logging out: " + err.message);
  }
};
```

### Progress Controller (`controllers/progressController.js`)

```javascript
const Progress = require("../models/Progress");

exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.json(progress);
  } catch (err) {
    res.status(500).send("Error fetching progress: " + err.message);
  }
};

exports.startStudySession = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { module } = req.body;

    let progress = await Progress.findOne({
      userId: req.user._id,
      taskId,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        taskId,
        module,
        status: "in-progress",
        startTime: new Date(),
      });
    } else {
      progress.status = "in-progress";
      progress.startTime = new Date();
      progress.lastUpdated = new Date();
    }

    await progress.save();
    res.json({ message: "Study session started", progress });
  } catch (err) {
    res.status(500).send("Error starting study session: " + err.message);
  }
};

exports.completeStudySession = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { duration } = req.body;

    const progress = await Progress.findOne({
      userId: req.user._id,
      taskId,
    });

    if (!progress) {
      return res.status(404).send("Progress record not found");
    }

    progress.status = "completed";
    progress.endTime = new Date();
    progress.totalDuration = duration;
    progress.lastUpdated = new Date();

    // Add to sessions array
    progress.sessions.push({
      start: progress.startTime,
      end: progress.endTime,
      duration: duration,
    });

    await progress.save();
    res.json({ message: "Study session completed", progress });
  } catch (err) {
    res.status(500).send("Error completing study session: " + err.message);
  }
};
```

### Validation Utilities (`utils/validation.js`)

```javascript
exports.validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }
};

exports.validateLoginData = (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
};
```

## Environment Variables

```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/ielts_prep_tracker
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=8h
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Security Considerations

- Use HTTPS in production
- Implement rate limiting on authentication endpoints
- Sanitize user input to prevent NoSQL injection
- Use environment variables for sensitive data
- Implement proper CORS configuration
- Regularly update dependencies for security patches

This backend implementation follows the established patterns from the MERN structure example, providing a secure foundation for the IELTS Prep Tracker application with user authentication and progress tracking functionality.
