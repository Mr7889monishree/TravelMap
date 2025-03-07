import { Schema, model } from "mongoose";

const pinSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Custom error message
      trim: true, // Removes extra spaces
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters long"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    lat: {
      type: Number,
      required: [true, "Latitude is required"],
      validate: {
        validator: (value) => value >= -90 && value <= 90,
        message: "Latitude must be between -90 and 90",
      },
    },
    long: {
      type: Number,
      required: [true, "Longitude is required"],
      validate: {
        validator: (value) => value >= -180 && value <= 180,
        message: "Longitude must be between -180 and 180",
      },
    },
  },
  { timestamps: true }
);

// Export model
export default model("Pin", pinSchema);
