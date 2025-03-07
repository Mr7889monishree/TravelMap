import { Router } from 'express';
const router = Router();
import Pin from '../models/pin.js'; // Remove { find }

// Create a pin
router.post('/', async (req, res) => {
  console.log('Request received to create a pin:', req.body); // Debugging: log request body

  const newPin = new Pin(req.body); // Instantiate a new Pin using the request body

  try {
    const savedPin = await newPin.save();
    console.log('Pin saved successfully:', savedPin); // Debugging: log saved pin
    res.status(200).json(savedPin);
  } catch (error) {
    console.error('Error saving pin:', error.message); // Debugging: log the error
    res.status(500).json({ error: 'Failed to save pin', details: error.message });
  }
});

// Get all pins
router.get('/', async (req, res) => {
  console.log('Request received to fetch all pins'); // Debugging: log request

  try {
    const pins = await Pin.find();
    console.log('Pins retrieved successfully:', pins.length, 'pins found'); // Debugging: log pins count
    res.status(200).json(pins);
  } catch (error) {
    console.error('Error fetching pins:', error.message); // Debugging: log the error
    res.status(500).json({ error: 'Failed to fetch pins', details: error.message });
  }
});

export default router;
