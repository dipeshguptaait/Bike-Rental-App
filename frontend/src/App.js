import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { BikesPage } from './pages/BikesPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
};
function App() {
    const { initializeAuth } = useAuthStore();
    useEffect(() => {
        initializeAuth();
    }, []);
    return (_jsx(Router, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/bikes", element: _jsx(BikesPage, {}) }), _jsx(Route, { path: "/booking", element: _jsx(ProtectedRoute, { children: _jsx(BookingPage, {}) }) }), _jsx(Route, { path: "/payment", element: _jsx(ProtectedRoute, { children: _jsx(PaymentPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }) }));
}
export default App;
