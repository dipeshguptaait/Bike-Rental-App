import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Alert } from '../components/Common';
export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
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
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: formData.address,
            });
            navigate('/bikes');
        }
        catch (err) {
            setLocalError(error || 'Registration failed');
        }
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Create Account" }), (localError || error) && (_jsx(Alert, { type: "error", message: localError || error || '', onClose: () => setLocalError(null) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "john@example.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Phone" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "1234567890" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Address" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "123 Main Street" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "Min. 6 characters" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Confirm Password" }), _jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600", placeholder: "Re-enter password" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition", children: isLoading ? 'Creating Account...' : 'Register' })] }), _jsxs("p", { className: "text-center mt-4 text-gray-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 font-medium hover:underline", children: "Login here" })] })] }) }) }));
};
