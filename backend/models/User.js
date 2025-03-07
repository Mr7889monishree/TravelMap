import { default as mongoose } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true, // Enforces unique usernames
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
          },
          message: (props) => `${props.value} is not a valid email!`,
        },
      },
      
    password: {
      type: String,
      required: true,
      minlength: 6, // Removed `unique: true`
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` timestamps
);

export default mongoose.model("user", UserSchema);
