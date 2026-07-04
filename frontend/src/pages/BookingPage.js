import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikeStore } from '../store/bikeStore';
import { useBookingStore } from '../store/bookingStore';
import { Alert } from '../components/Common';
import { calculateDuration, formatCurrency } from '../utils/formatting';
export const BookingPage = () => {
    const navigate = useNavigate();
    const { selectedBike, clearSelection } = useBikeStore();
    const { createBooking, isLoading, error } = useBookingStore();
    const [bookingType, setBookingType] = useState('hourly');
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [validationError, setValidationError] = useState(null);
    // Recalculate cost whenever dates, times, quantity, or booking type changes
    useEffect(() => {
        if (!startDate || !endDate || !startTime || !endTime || isNaN(quantity) || quantity < 1) {
            setTotalCost(0);
            return;
        }
        try {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
                setTotalCost(0);
                return;
            }
            const duration = calculateDuration(start, end, bookingType);
            if (duration <= 0) {
                setTotalCost(0);
                return;
            }
            const rate = bookingType === 'hourly'
                ? selectedBike?.bikeType?.hourlyRate || 10
                : selectedBike?.bikeType?.monthlyRate || 100;
            const cost = duration * rate * quantity;
            setTotalCost(isNaN(cost) ? 0 : cost);
        }
        catch (err) {
            console.error('Error calculating cost:', err);
            setTotalCost(0);
        }
    }, [startDate, startTime, endDate, endTime, quantity, bookingType, selectedBike]);
    if (!selectedBike) {
        return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("p", { className: "text-gray-600", children: "No bike selected" }), _jsx("button", { onClick: () => navigate('/bikes'), className: "mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700", children: "Back to Bikes" })] }) }) }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(null);
        console.log('Form submission:', { startDate, endDate, startTime, endTime, quantity, bookingType });
        // Field validation - check for empty strings
        if (!startDate) {
            setValidationError('Start date is required');
            return;
        }
        if (!startTime) {
            setValidationError('Start time is required');
            return;
        }
        if (!endDate) {
            setValidationError('End date is required');
            return;
        }
        if (!endTime) {
            setValidationError('End time is required');
            return;
        }
        if (isNaN(quantity) || quantity < 1) {
            setValidationError('Quantity must be at least 1');
            return;
        }
        // Validate date/time logic
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        console.log('Parsed dates:', { start: start.toISOString(), end: end.toISOString() });
        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            setValidationError('Invalid date or time format');
            return;
        }
        if (end <= start) {
            setValidationError('End date/time must be after start date/time');
            return;
        }
        // Calculate duration
        const duration = calculateDuration(start, end, bookingType);
        console.log('Duration:', duration);
        if (duration <= 0) {
            setValidationError('Booking duration must be at least 1 hour');
            return;
        }
        try {
            console.log('Creating booking...');
            const booking = await createBooking({
                bikeId: selectedBike.id,
                bookingType,
                startDate: `${startDate}T${startTime}`,
                endDate: `${endDate}T${endTime}`,
                quantity,
            });
            console.log('Booking created:', booking);
            // Calculate cost for display on payment page
            const rate = bookingType === 'hourly'
                ? selectedBike.bikeType?.hourlyRate || 10
                : selectedBike.bikeType?.monthlyRate || 100;
            const finalTotalCost = duration * rate * quantity;
            console.log('Final cost:', finalTotalCost);
            navigate('/payment', { state: { booking, totalCost: finalTotalCost } });
        }
        catch (err) {
            console.error('Booking error:', err);
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create booking. Please try again.';
            setValidationError(errorMsg);
        }
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Book Your Bike" }), error && _jsx(Alert, { type: "error", message: error }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: selectedBike.name }), _jsxs("div", { className: "space-y-2 text-gray-600", children: [_jsxs("p", { children: [_jsx("strong", { children: "Registration:" }), " ", selectedBike.registrationNumber] }), _jsxs("p", { children: [_jsx("strong", { children: "Location:" }), " ", selectedBike.location] }), _jsxs("p", { children: [_jsx("strong", { children: "Condition:" }), " ", selectedBike.condition] }), _jsxs("p", { children: [_jsx("strong", { children: "Available:" }), " ", selectedBike.availableQuantity] })] }), _jsx("button", { onClick: () => {
                                            clearSelection();
                                            navigate('/bikes');
                                        }, className: "w-full mt-6 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition", children: "Change Bike" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(validationError || error) && (_jsx(Alert, { type: "error", message: validationError || error || '', onClose: () => setValidationError(null) })), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Booking Type" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: "hourly", checked: bookingType === 'hourly', onChange: (e) => setBookingType(e.target.value), className: "mr-2" }), "Hourly"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: "monthly", checked: bookingType === 'monthly', onChange: (e) => setBookingType(e.target.value), className: "mr-2" }), "Monthly"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Quantity" }), _jsx("input", { type: "number", min: "1", max: selectedBike.availableQuantity, value: quantity, onChange: (e) => {
                                                        const val = e.target.value ? parseInt(e.target.value) : 1;
                                                        setQuantity(Math.max(1, isNaN(val) ? 1 : val));
                                                    }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Start Time" }), _jsx("input", { type: "time", value: startTime, onChange: (e) => setStartTime(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "End Date" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "End Time" }), _jsx("input", { type: "time", value: endTime, onChange: (e) => setEndTime(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), totalCost > 0 && (_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: [_jsx("p", { className: "text-gray-600 mb-2", children: "Total Cost:" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: formatCurrency(totalCost) })] })), _jsx("button", { type: "submit", disabled: isLoading || !startDate || !endDate || !startTime || !endTime, className: "w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition", children: isLoading ? 'Creating Booking...' : 'Continue to Payment' })] }) })] })] }) }) }));
};
