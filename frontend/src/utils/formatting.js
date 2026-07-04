export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};
export const calculateDuration = (startDate, endDate, type) => {
    const diffMs = endDate.getTime() - startDate.getTime();
    if (type === 'hourly') {
        return Math.ceil(diffMs / (1000 * 60 * 60));
    }
    else {
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
    }
};
export const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const formatTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500';
        case 'confirmed':
            return 'bg-blue-600';
        case 'active':
            return 'bg-green-500';
        case 'completed':
            return 'bg-gray-600';
        case 'cancelled':
            return 'bg-red-600';
        default:
            return 'bg-gray-500';
    }
};
