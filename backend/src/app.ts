import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import connectDB from './config/database';

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
    origin: 'https://bike-rental-frontend-w39c.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', routes);

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: `${req.method} ${req.path} endpoint does not exist`,
    });
});

// Error handling middleware
app.use(errorHandler);

export default app;