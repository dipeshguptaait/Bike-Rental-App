"use strict";
// Utility functions for validation
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = exports.isDateValid = exports.calculateBookingCost = exports.isValidPhone = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPhone = (phone) => {
    // Basic phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
exports.isValidPhone = isValidPhone;
const calculateBookingCost = (hourlyRate, monthlyRate, bookingType, startDate, endDate, quantity) => {
    const timeInMs = endDate.getTime() - startDate.getTime();
    if (bookingType === 'hourly') {
        const hours = Math.ceil(timeInMs / (1000 * 60 * 60));
        return hours * hourlyRate * quantity;
    }
    else {
        // Monthly booking
        const months = Math.ceil(timeInMs / (1000 * 60 * 60 * 24 * 30));
        return months * monthlyRate * quantity;
    }
};
exports.calculateBookingCost = calculateBookingCost;
const isDateValid = (startDate, endDate) => {
    return startDate < endDate && startDate > new Date();
};
exports.isDateValid = isDateValid;
const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
exports.generateTransactionId = generateTransactionId;
