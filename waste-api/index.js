import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import reportRoutes from './routes/reports.js';

dotenv.config({ path: './.env' });

const app = express();   // ✅ MOVE THIS UP

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not set in .env');
  process.exit(1);
}

// ✅ ROOT ROUTE (NOW CORRECT)
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

// ✅ API ROUTE
app.use('/api/reports', reportRoutes);

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