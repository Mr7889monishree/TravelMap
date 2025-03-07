import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import pinRouter from "./Routes/Userpin.js";
import userRouter from "./Routes/User.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

config(); // Load environment variables from .env


const app = express();
const PORT = process.env.PORT || 3700;

// CORS configuration
/* const corsOptions = {
  origin: [
    "http://localhost:3000", // Local frontend for development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies and credentials
}; */
app.use(cors({ origin: '*' })); // Allow all origins

app.use(json()); // Parse JSON request bodies

// MongoDB connection
connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process on failure
  });

// Basic route for testing
app.get("/api", (req, res) => {
  res.send("API IS WORKING");
});

// Route handlers
app.use("/api/users", userRouter);
app.use("/api/pins", pinRouter);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
