const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema (
    {
        chat: String,
        user: {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            name: String,
        },
        room: {
            type: mongoose.Schema.ObjectId,
            ref: "Room",
        },
        timestamp: { type: Date, default: Date.now }
    },
   
);

module.exports = mongoose.model("Chat", chatSchema);