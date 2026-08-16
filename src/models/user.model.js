import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        default: null
    }
});

export  const User = mongoose.model("User", userSchema);