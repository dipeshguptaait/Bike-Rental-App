export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string | Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BikeType {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  monthlyRate: number;
}

export interface Bike {
  id: string;
  name: string;
  bikeTypeId: string;
  registrationNumber: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: string;
  location: string;
  isActive: boolean;
  bikeType?: BikeType;
}

export interface BikeWithType extends Bike {
  bikeType?: BikeType;
}

export interface Booking {
  id: string;
  userId: string;
  bikeId: string;
  bookingType: 'hourly' | 'monthly';
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  quantity: number;
  paymentId?: string;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
