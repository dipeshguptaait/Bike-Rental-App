// Utility functions for validation

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    // Basic phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const calculateBookingCost = (
    hourlyRate: number,
    monthlyRate: number,
    bookingType: 'hourly' | 'monthly',
    startDate: Date,
    endDate: Date,
    quantity: number
): number => {
    const timeInMs = endDate.getTime() - startDate.getTime();

    if (bookingType === 'hourly') {
        const hours = Math.ceil(timeInMs / (1000 * 60 * 60));
        return hours * hourlyRate * quantity;
    } else {
        // Monthly booking
        const months = Math.ceil(timeInMs / (1000 * 60 * 60 * 24 * 30));
        return months * monthlyRate * quantity;
    }
};

export const isDateValid = (startDate: Date, endDate: Date): boolean => {
    return startDate < endDate && startDate > new Date();
};

export const generateTransactionId = (): string => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
