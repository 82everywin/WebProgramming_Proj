const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room: { 
      type: String,
      required : true
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
