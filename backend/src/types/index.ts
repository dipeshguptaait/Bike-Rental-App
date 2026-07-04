// User related types
export interface IRegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

// Booking related types
export interface IBookingRequest {
    bikeId: string;
    bookingType: 'hourly' | 'monthly';
    startDate: string;
    endDate: string;
    quantity: number;
}

export interface IBookingResponse {
    id: string;
    userId: string;
    bikeId: string;
    bookingType: string;
    startDate: Date;
    endDate: Date;
    totalCost: number;
    status: string;
    quantity: number;
}

// Payment related types
export interface IPaymentRequest {
    bookingId: string;
    amount: number;
    paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet';
}

export interface IPaymentResponse {
    id: string;
    userId: string;
    bookingId: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    transactionId?: string;
}

// Bike related types
export interface IBikeResponse {
    id: string;
    name: string;
    bikeTypeId: string;
    registrationNumber: string;
    totalQuantity: number;
    availableQuantity: number;
    condition: string;
    location: string;
    isActive: boolean;
}

// API Response types
export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

// JWT Payload
export interface IJWTPayload {
    userId: string;
    email: string;
}