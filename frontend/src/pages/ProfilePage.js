import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Alert } from '../components/Common';
export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateProfile, isLoading } = useAuthStore();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await updateProfile(formData);
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };
    return (_jsx("main", { className: "flex-1 bg-gray-50 py-12", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Edit Profile" }), error && _jsx(Alert, { type: "error", message: error }), success && _jsx(Alert, { type: "success", message: success }), _jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Full Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, disabled: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Email cannot be changed" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Phone Number" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, placeholder: "+1 (555) 000-0000", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Address" }), _jsx("textarea", { name: "address", value: formData.address, onChange: handleChange, placeholder: "Enter your full address", rows: 4, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: isLoading, className: "flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition", children: isLoading ? 'Saving...' : 'Save Changes' }), _jsx("button", { type: "button", onClick: () => navigate('/dashboard'), className: "flex-1 bg-gray-300 text-gray-800 py-2 rounded font-medium hover:bg-gray-400 transition", children: "Cancel" })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 mt-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Change Password" }), _jsx("p", { className: "text-gray-600 mb-4", children: "To ensure your account security, please contact support to change your password." }), _jsx("button", { className: "bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700", children: "Contact Support" })] })] }) }) }));
};
