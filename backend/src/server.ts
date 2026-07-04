import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  Bike Rental Service API              ║
    ║  Server running on:                   ║
    ║  http://localhost:${PORT}                      ║
    ╚════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});