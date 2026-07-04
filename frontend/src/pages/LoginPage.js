import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Alert } from '../components/Common';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [localError, setLocalError] = useState(null);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        try {
            await login(formData.email, formData.password);
            navigate('/bikes');
        }
        catch (err) {
            setLocalError(error || 'Login failed');
        }
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Login" }), (localError || error) && (_jsx(Alert, { type: "error", message: localError || error || '', onClose: () => setLocalError(null) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "john@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "Enter your password" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition", children: isLoading ? 'Logging in...' : 'Login' })] }), _jsxs("p", { className: "text-center mt-4 text-gray-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-blue-600 font-medium hover:underline", children: "Register here" })] })] }) }) }));
};
