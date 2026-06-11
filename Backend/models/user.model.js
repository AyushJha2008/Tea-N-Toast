import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false
    }
}, {timestamps: true}
)

export const User = mongoose.model('User', userSchema);