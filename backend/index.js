const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Move this to the top for clarity
const pinRouter = require('./Routes/Userpin');
const userRouter = require('./Routes/User');

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3600;

// CORS configuration
const corsOptions = {
    origin: 'https://travel-map-rjgc.vercel.app', // Replace with your Vercel domain
};
app.use(cors(corsOptions)); // Apply the CORS middleware

app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully!');
})
.catch((err) => {
    console.error('MongoDB connection error:', err.message);
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send("APP IS WORKING");
});

// Route handlers
app.use('/api/users', userRouter);
app.use('/api/pins', pinRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, (error) => {
    if (error) {
        console.error(`Error starting server: ${error.message}`);
    } else {
        console.log(`The server is running on port: ${PORT}`);
    }
});
