import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Alert, Loading } from '../components/Common';
import { formatCurrency, getStatusColor, formatDate } from '../utils/formatting';
import { Trash2, Eye } from 'lucide-react';
export const DashboardPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuthStore();
    const { bookings, isLoading, fetchUserBookings, cancelBooking } = useBookingStore();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchUserBookings();
    }, [isAuthenticated]);
    const state = location.state;
    if (!isAuthenticated) {
        return null;
    }
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "My Dashboard" }), _jsx("button", { onClick: () => navigate('/profile'), className: "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700", children: "Edit Profile" })] }), state?.success && _jsx(Alert, { type: "success", message: state.success }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-8", children: [_jsxs("h2", { className: "text-2xl font-bold mb-4", children: ["Welcome, ", user?.name, "!"] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-gray-600", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Email" }), _jsx("p", { className: "font-medium", children: user?.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Phone" }), _jsx("p", { className: "font-medium", children: user?.phone || 'Not provided' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Address" }), _jsx("p", { className: "font-medium", children: user?.address || 'Not provided' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Member Since" }), _jsx("p", { className: "font-medium", children: user?.createdAt ? formatDate(new Date(user.createdAt)) : 'Recently' })] })] })] }), _jsx("h2", { className: "text-2xl font-bold mb-4", children: "My Bookings" }), isLoading ? (_jsx(Loading, { message: "Loading your bookings..." })) : bookings.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-12 text-center", children: [_jsx("p", { className: "text-gray-600 text-lg mb-4", children: "No bookings yet" }), _jsx("button", { onClick: () => navigate('/bikes'), className: "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700", children: "Browse Bikes" })] })) : (_jsx("div", { className: "space-y-4", children: bookings.map((booking) => (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition", children: [_jsxs("div", { className: "grid md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Booking ID" }), _jsx("p", { className: "font-bold", children: booking.id })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Bike" }), _jsx("p", { className: "font-medium", children: booking.bikeId })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Type" }), _jsx("p", { className: "font-medium capitalize", children: booking.bookingType })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Status" }), _jsx("p", { className: `font-bold px-3 py-1 rounded text-white text-sm ${getStatusColor(booking.status)}`, children: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) })] })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 text-gray-600 mb-4 pb-4 border-b", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm", children: ["Start: ", formatDate(new Date(booking.startDate))] }), _jsxs("p", { className: "text-sm", children: ["End: ", formatDate(new Date(booking.endDate))] })] }), _jsx("div", { children: _jsxs("p", { className: "text-sm", children: ["Quantity: ", booking.quantity] }) }), _jsx("div", { children: _jsx("p", { className: "text-lg font-bold text-blue-600", children: booking.totalCost ? formatCurrency(booking.totalCost) : 'N/A' }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => navigate(`/booking-details/${booking.id}`), className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition", children: [_jsx(Eye, { size: 16 }), "View Details"] }), booking.status === 'pending' && (_jsxs("button", { onClick: () => {
                                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                cancelBooking(booking.id);
                                            }
                                        }, className: "flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition", children: [_jsx(Trash2, { size: 16 }), "Cancel"] }))] })] }, booking.id))) }))] }) }));
};
