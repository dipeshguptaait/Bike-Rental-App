import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikeStore } from '../store/bikeStore';
import { useAuthStore } from '../store/authStore';
import { BikeCard, Loading, Alert } from '../components/Common';
export const BikesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { bikes, isLoading, error, fetchBikes, selectBike } = useBikeStore();
    const [selectedLocation, setSelectedLocation] = useState('');
    const [filteredBikes, setFilteredBikes] = useState(bikes);
    useEffect(() => {
        fetchBikes();
    }, []);
    useEffect(() => {
        if (selectedLocation) {
            setFilteredBikes(bikes.filter((bike) => bike.location.toLowerCase().includes(selectedLocation.toLowerCase())));
        }
        else {
            setFilteredBikes(bikes);
        }
    }, [bikes, selectedLocation]);
    const handleSelectBike = (bike) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        selectBike(bike);
        navigate('/booking');
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h1", { className: "text-4xl font-bold mb-8", children: "Browse Bikes" }), error && _jsx(Alert, { type: "error", message: error }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Filter Bikes" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("input", { type: "text", placeholder: "Filter by location...", value: selectedLocation, onChange: (e) => setSelectedLocation(e.target.value), className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" }), _jsx("button", { onClick: () => setSelectedLocation(''), className: "px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition", children: "Clear" })] })] }), isLoading ? (_jsx(Loading, { message: "Loading bikes..." })) : filteredBikes.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-12 text-center", children: _jsx("p", { className: "text-gray-600 text-lg", children: "No bikes available matching your filters" }) })) : (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredBikes.map((bike) => (_jsx(BikeCard, { bike: bike, onSelectBike: handleSelectBike }, bike.id))) })), _jsx("div", { className: "mt-12 text-center text-gray-600", children: _jsxs("p", { children: ["Showing ", filteredBikes.length, " bikes"] }) })] }) }));
};
