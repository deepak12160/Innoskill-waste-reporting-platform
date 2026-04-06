import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import reportRoutes from './routes/reports.js';

const result = dotenv.config();

if (result.error) {
  console.warn('⚠️  Warning: .env file not found. Ensure environment variables are set manually.');
}

const app = express();   // ✅ MOVE THIS UP

console.log('🔌 Attempting to connect to database...');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({ useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 } }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('YOUR_CONNECTION_STRING')) {
  console.error('❌ Error: MONGO_URI is missing or using a placeholder in .env');
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

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${process.env.PORT || 5001} is already in use.`);
        console.error('💡 Try killing the process or changing the PORT in your .env file.');
      } else {
        console.error('❌ Server Error:', err);
      }
      process.exit(1);
    });

    server.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5001}`);
    });
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  });