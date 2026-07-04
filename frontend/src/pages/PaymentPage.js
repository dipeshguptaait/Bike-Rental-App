import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import apiService from '../services/apiService';
import { Alert } from '../components/Common';
import { formatCurrency } from '../utils/formatting';
export const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addBooking } = useBookingStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    });
    const state = location.state;
    if (!state || !state.booking) {
        return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("p", { className: "text-gray-600", children: "Invalid payment session" }), _jsx("button", { onClick: () => navigate('/bikes'), className: "mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700", children: "Back to Bikes" })] }) }) }));
    }
    const { booking, totalCost } = state;
    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');
        try {
            // Process payment
            await apiService.processPayment({
                bookingId: booking.id,
                amount: totalCost,
                paymentMethod,
                transactionId: `TXN-${Date.now()}`,
            });
            // Add to bookings store
            addBooking(booking);
            // Redirect to success
            navigate('/dashboard', {
                state: { success: 'Payment successful! Your booking is confirmed.' },
            });
        }
        catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Complete Payment" }), error && _jsx(Alert, { type: "error", message: error }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Order Summary" }), _jsxs("div", { className: "space-y-2 text-gray-600", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Booking ID:" }), _jsx("span", { className: "font-medium", children: booking.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Bike:" }), _jsx("span", { className: "font-medium", children: booking.bikeId })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Duration:" }), _jsx("span", { className: "font-medium", children: booking.bookingType })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Quantity:" }), _jsx("span", { className: "font-medium", children: booking.quantity })] }), _jsx("hr", { className: "my-2" }), _jsxs("div", { className: "flex justify-between text-lg font-bold text-blue-600", children: [_jsx("span", { children: "Total Amount:" }), _jsx("span", { children: formatCurrency(totalCost) })] })] }), _jsx("div", { className: "bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200", children: _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Note:" }), " This is a demo payment system. Use test card: 4111 1111 1111 1111"] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-6", children: _jsxs("form", { onSubmit: handlePayment, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Payment Method" }), _jsx("div", { className: "space-y-2", children: ['credit_card', 'debit_card', 'upi'].map((method) => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: method, checked: paymentMethod === method, onChange: (e) => setPaymentMethod(e.target.value), className: "mr-2" }), method === 'credit_card'
                                                                ? 'Credit Card'
                                                                : method === 'debit_card'
                                                                    ? 'Debit Card'
                                                                    : 'UPI'] }, method))) })] }), ['credit_card', 'debit_card'].includes(paymentMethod) && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Cardholder Name" }), _jsx("input", { type: "text", value: cardDetails.cardholderName, onChange: (e) => setCardDetails({
                                                                ...cardDetails,
                                                                cardholderName: e.target.value,
                                                            }), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg", placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Card Number" }), _jsx("input", { type: "text", value: cardDetails.cardNumber, onChange: (e) => setCardDetails({
                                                                ...cardDetails,
                                                                cardNumber: e.target.value.replace(/\s/g, ''),
                                                            }), required: true, placeholder: "4111 1111 1111 1111", maxLength: 16, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Expiry Date" }), _jsx("input", { type: "text", value: cardDetails.expiryDate, onChange: (e) => setCardDetails({
                                                                        ...cardDetails,
                                                                        expiryDate: e.target.value,
                                                                    }), required: true, placeholder: "MM/YY", maxLength: 5, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "CVV" }), _jsx("input", { type: "text", value: cardDetails.cvv, onChange: (e) => setCardDetails({
                                                                        ...cardDetails,
                                                                        cvv: e.target.value,
                                                                    }), required: true, placeholder: "123", maxLength: 3, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] })] })] })), paymentMethod === 'upi' && (_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "UPI ID" }), _jsx("input", { type: "email", placeholder: "username@upi", required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg" })] })), _jsx("button", { type: "submit", disabled: isProcessing, className: "w-full bg-green-600 text-white py-3 rounded font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 transition", children: isProcessing ? 'Processing...' : `Pay ${formatCurrency(totalCost)}` }), _jsx("p", { className: "text-xs text-gray-500 text-center", children: "Your payment information is secure and encrypted." })] }) })] })] }) }) }));
};
