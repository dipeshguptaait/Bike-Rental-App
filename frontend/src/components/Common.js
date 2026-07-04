import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
export const Alert = ({ type, message, onClose }) => {
    const bgColor = {
        error: 'bg-red-100',
        success: 'bg-green-100',
        info: 'bg-blue-100',
    }[type];
    const textColor = {
        error: 'text-red-800',
        success: 'text-green-800',
        info: 'text-blue-800',
    }[type];
    const Icon = {
        error: AlertCircle,
        success: CheckCircle,
        info: Info,
    }[type];
    return (_jsxs("div", { className: `${bgColor} ${textColor} p-4 rounded-lg flex items-center gap-3 mb-4`, children: [_jsx(Icon, { size: 20 }), _jsx("span", { children: message }), onClose && (_jsx("button", { onClick: onClose, className: "ml-auto font-bold hover:opacity-70", children: "\u00D7" }))] }));
};
export const Loading = ({ message = 'Loading...', }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" }), _jsx("p", { className: "mt-4 text-gray-600", children: message })] }));
};
export const BikeCard = ({ bike, onSelectBike }) => {
    const conditionColor = {
        Excellent: 'bg-green-100 text-green-800',
        Good: 'bg-blue-100 text-blue-800',
        Fair: 'bg-yellow-100 text-yellow-800',
        Poor: 'bg-red-100 text-red-800',
    };
    // Fallback values for missing fields
    const bikeName = bike?.name || 'Bike';
    const registrationNumber = bike?.registrationNumber || bike?.regNo || 'N/A';
    const location = bike?.location || 'Not Specified';
    const availableQuantity = bike?.availableQuantity !== undefined ? bike.availableQuantity : bike?.available || 0;
    const totalQuantity = bike?.totalQuantity !== undefined ? bike.totalQuantity : bike?.total || 1;
    const condition = bike?.condition || 'Good';
    const isActive = bike?.isActive !== undefined ? bike.isActive : true;
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800", children: bikeName }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["Reg ID: ", _jsx("span", { className: "font-medium", children: registrationNumber })] })] }), _jsxs("div", { className: "space-y-3 mb-4 border-t pt-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600 text-sm", children: "\uD83D\uDCCD Location:" }), _jsx("span", { className: "font-medium text-gray-800", children: location })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600 text-sm", children: "\uD83D\uDEB2 Available:" }), _jsxs("span", { className: "font-medium text-gray-800", children: [availableQuantity, " / ", totalQuantity] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Condition:" }), _jsx("span", { className: `px-3 py-1 rounded text-xs font-medium ${conditionColor[condition] || 'bg-gray-100 text-gray-800'}`, children: condition })] })] }), _jsx("button", { onClick: () => onSelectBike(bike), disabled: availableQuantity === 0 || !isActive, className: "w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition", children: availableQuantity === 0 || !isActive ? 'Not Available' : 'Book Now' })] }));
};
