import { Router } from 'express';
const router = Router();
import User from '../models/User.js'; // Corrected the model import
import { genSalt, hash, compare } from 'bcryptjs';

// Simple GET route to check if the API is working
router.get('/', async (req, res) => {
    res.status(200).json({ message: 'User API is working' });
});

// Register route
router.post('/register', async (req, res) => {
    try {
        // Validate request body
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists (by email or username)
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Generate new password
        const salt = await genSalt();
        const hashedPassword = await hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        const savedUser = await newUser.save();
        res.status(200).json({ userId: savedUser._id }); // Return the user ID

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Wrong username or password." });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong username or password." });
    }

    // If everything is correct, return success response
    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


export default router;
