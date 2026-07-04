import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
class ApiService {
    constructor() {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add token to requests
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
    // Auth endpoints
    async register(data) {
        const response = await this.api.post('/auth/register', data);
        return response.data;
    }
    async login(email, password) {
        const response = await this.api.post('/auth/login', { email, password });
        return response.data;
    }
    async getProfile() {
        const response = await this.api.get('/auth/profile');
        return response.data;
    }
    async updateProfile(data) {
        const response = await this.api.put('/auth/profile', data);
        return response.data;
    }
    // Bike Type endpoints
    async getBikeTypes() {
        const response = await this.api.get('/bike-types');
        return response.data;
    }
    async getBikeTypeById(id) {
        const response = await this.api.get(`/bike-types/${id}`);
        return response.data;
    }
    // Bike endpoints
    async getBikes() {
        const response = await this.api.get('/bikes');
        return response.data;
    }
    async getBikeById(id) {
        const response = await this.api.get(`/bikes/${id}`);
        return response.data;
    }
    async getAvailableBikes() {
        const response = await this.api.get('/bikes/available/all');
        return response.data;
    }
    // Booking endpoints
    async createBooking(data) {
        const response = await this.api.post('/bookings', data);
        return response.data;
    }
    async getMyBookings(status) {
        const response = await this.api.get('/bookings', {
            params: status ? { status } : {},
        });
        return response.data;
    }
    async getBookingById(id) {
        const response = await this.api.get(`/bookings/${id}`);
        return response.data;
    }
    async cancelBooking(id) {
        const response = await this.api.put(`/bookings/${id}/cancel`, {});
        return response.data;
    }
    // Payment endpoints
    async processPayment(data) {
        const response = await this.api.post('/payments', data);
        return response.data;
    }
    async createPaymentIntent(data) {
        const response = await this.api.post('/payments/create-intent', data);
        return response.data;
    }
    async getMyPayments(status) {
        const response = await this.api.get('/payments', {
            params: status ? { status } : {},
        });
        return response.data;
    }
    async getPaymentById(id) {
        const response = await this.api.get(`/payments/${id}`);
        return response.data;
    }
    // Health check
    async healthCheck() {
        const response = await this.api.get('/health');
        return response.data;
    }
}
export default new ApiService();
