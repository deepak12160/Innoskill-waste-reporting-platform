require('dotenv').config({ path: './.env' });
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database - Replace with your actual Mongo URI in .env
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not set in .env');
  process.exit(1);
}

app.use('/api/reports', require('./routes/reports'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');

    server.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5001}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });