import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Home, Bike, ShoppingCart } from 'lucide-react';
export const Header = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    return (_jsx("header", { className: "bg-blue-600 text-white shadow-lg", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 text-2xl font-bold", children: [_jsx(Bike, { size: 32 }), "BikeRent"] }), _jsxs("nav", { className: "flex items-center gap-6", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-1 hover:text-blue-100 transition", children: [_jsx(Home, { size: 20 }), "Home"] }), _jsxs(Link, { to: "/bikes", className: "flex items-center gap-1 hover:text-blue-100 transition", children: [_jsx(Bike, { size: 20 }), "Browse Bikes"] }), isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/bookings", className: "flex items-center gap-1 hover:text-blue-100 transition", children: [_jsx(ShoppingCart, { size: 20 }), "My Bookings"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Link, { to: "/profile", className: "flex items-center gap-1 hover:text-blue-100 transition", children: [_jsx(User, { size: 20 }), user?.name] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition", children: [_jsx(LogOut, { size: 20 }), "Logout"] })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "hover:text-blue-100 transition font-medium", children: "Login" }), _jsx(Link, { to: "/register", className: "bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition", children: "Register" })] }))] })] }) }) }));
};
export const Footer = () => {
    return (_jsx("footer", { className: "bg-gray-800 text-white mt-12", children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid md:grid-cols-3 gap-8 mb-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "BikeRent" }), _jsx("p", { className: "text-gray-400", children: "Your premium bike rental service. Eco-friendly transportation made easy." })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold mb-4", children: "Quick Links" }), _jsxs("ul", { className: "space-y-2 text-gray-400", children: [_jsx("li", { children: _jsx(Link, { to: "/bikes", className: "hover:text-white transition", children: "Browse Bikes" }) }), _jsx("li", { children: _jsx(Link, { to: "/about", className: "hover:text-white transition", children: "About Us" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:text-white transition", children: "Contact" }) })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold mb-4", children: "Contact" }), _jsx("p", { className: "text-gray-400", children: "Email: info@bikerent.com" }), _jsx("p", { className: "text-gray-400", children: "Phone: (555) 123-4567" })] })] }), _jsx("div", { className: "border-t border-gray-700 pt-8 text-center text-gray-400", children: _jsx("p", { children: "\u00A9 2024 BikeRent. All rights reserved." }) })] }) }));
};
const Layout = ({ children }) => {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Header, {}), children, _jsx(Footer, {})] }));
};
export default Layout;
