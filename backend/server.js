import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './src/middlewares/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import videoRoutes from './src/routes/videoRoutes.js';
import pool from './src/config/db.js';

// 1. Initialize environment variables first
dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Routes
app.use('/auth', authRoutes);
app.use('/videos', videoRoutes);

// 4. Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// 5. Start Server only after verifying database connectivity
async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();