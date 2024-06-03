const Room = require('./Models/room');

/**
  Module dependencies.
 */
// express : 서버 
const express = require('express');
const axios = require('axios');
var http = require('http');
require('dotenv').config()
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.DB)
  .then( async() => {
    console.log("[Server] connected to database");

  const rooms = await Room.find({});
    if (rooms.length === 0) {
      const initialRooms = [
        { room: '자바스크립트 단톡방', members: [] },
        { room: '리액트 단톡방', members: [] },
        { room: 'NodeJS 단톡방', members: [] },
      ];
      await Room.insertMany(initialRooms);
      console.log('[Server] Initial rooms created');
    };
      
  })

 
  .catch(err => {
    console.error('Database connection error', err);
});


app.post('/api/chatgpt', async (req, res) => {
  console.log('Received request:', req.body); 
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.json(response.data);
    console.log("[proxyServer]", response.data);
  } catch (error) {
    console.error('[Server] Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
});


module.exports = app;


