const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "User must type name"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "User must type password"],
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
    },
    token: {
        type: String,
    }
});

module.exports = mongoose.model("User", userSchema); 