# 🚴 Bike Rental Service - Backend API

A comprehensive Node.js/Express backend application for a bike rental service with user authentication, bike management, booking system, and payment processing.

## Features

✅ **User Authentication** - Register, login with JWT tokens
✅ **Bike Management** - Add, update, delete bikes and bike types
✅ **Booking System** - Create, manage, and cancel bike bookings
✅ **Payment Processing** - Handle payments for bookings
✅ **Availability Management** - Track bike availability in real-time
✅ **TypeScript** - Full type safety
✅ **MongoDB** - NoSQL database integration
✅ **Error Handling** - Comprehensive error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd backend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/bike-rental

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=your-stripe-secret-key

# Application
APP_NAME=Bike Rental Service
APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── config/              # Configuration files
│   └── database.ts      # MongoDB connection
├── controllers/         # Business logic
│   ├── authController.ts
│   ├── bikeController.ts
│   ├── bikeTypeController.ts
│   ├── bookingController.ts
│   ├── paymentController.ts
│   └── index.ts
├── middleware/          # Express middleware
│   ├── auth.ts         # JWT authentication
│   ├── errorHandler.ts # Global error handling
│   └── index.ts
├── models/             # MongoDB schemas
│   ├── User.ts
│   ├── BikeType.ts
│   ├── Bike.ts
│   ├── Booking.ts
│   ├── Payment.ts
│   └── index.ts
├── routes/             # API endpoints
│   ├── authRoutes.ts
│   ├── bikeRoutes.ts
│   ├── bikeTypeRoutes.ts
│   ├── bookingRoutes.ts
│   ├── paymentRoutes.ts
│   └── index.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── utils/              # Utility functions
│   ├── jwt.ts          # JWT utilities
│   ├── validation.ts   # Validation helpers
│   └── index.ts
├── app.ts              # Express app setup
├── server.ts           # Server entry point
└── tsconfig.json       # TypeScript configuration
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123",
    "address": "123 Main St"
}

Response (201):
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "token": "jwt-token",
        "user": { ... }
    }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}

Response (200):
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "jwt-token",
        "user": { ... }
    }
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer {token}

Response (200):
{
    "success": true,
    "message": "Profile retrieved successfully",
    "data": { ... }
}
```

#### Update Profile
```
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Jane Doe",
    "phone": "9876543210",
    "address": "456 Oak St"
}
```

### Bike Type Endpoints

#### Get All Bike Types
```
GET /bike-types
```

#### Get Bike Type by ID
```
GET /bike-types/:id
```

#### Create Bike Type
```
POST /bike-types
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Standard",
    "description": "Standard city bike",
    "hourlyRate": 5,
    "monthlyRate": 100
}
```

#### Update Bike Type
```
PUT /bike-types/:id
Authorization: Bearer {token}
```

#### Delete Bike Type
```
DELETE /bike-types/:id
Authorization: Bearer {token}
```

### Bike Endpoints

#### Get All Bikes
```
GET /bikes
Query Parameters:
- bikeTypeId (optional)
- location (optional)
- isActive (optional)
```

#### Get Available Bikes
```
GET /bikes/available/all
```

#### Get Bike by ID
```
GET /bikes/:id
```

#### Create Bike
```
POST /bikes
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Bike 001",
    "bikeTypeId": "type-id",
    "registrationNumber": "REG-001",
    "totalQuantity": 10,
    "condition": "Good",
    "location": "Downtown"
}
```

#### Update Bike
```
PUT /bikes/:id
Authorization: Bearer {token}
```

#### Delete Bike
```
DELETE /bikes/:id
Authorization: Bearer {token}
```

### Booking Endpoints

#### Create Booking
```
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
    "bikeId": "bike-id",
    "bookingType": "hourly",  // or "monthly"
    "startDate": "2024-01-01T10:00:00Z",
    "endDate": "2024-01-01T12:00:00Z",
    "quantity": 2
}

Response (201):
{
    "success": true,
    "message": "Booking created successfully. Please proceed with payment.",
    "data": {
        "id": "booking-id",
        "totalCost": 20,
        "status": "pending",
        ...
    }
}
```

#### Get User Bookings
```
GET /bookings
Authorization: Bearer {token}
Query Parameters:
- status (optional): pending, confirmed, active, completed, cancelled
```

#### Get Booking by ID
```
GET /bookings/:id
Authorization: Bearer {token}
```

#### Cancel Booking
```
PUT /bookings/:id/cancel
Authorization: Bearer {token}
```

#### Complete Booking
```
PUT /bookings/:id/complete
Authorization: Bearer {token}
```

### Payment Endpoints

#### Process Payment
```
POST /payments
Authorization: Bearer {token}
Content-Type: application/json

{
    "bookingId": "booking-id",
    "amount": 20,
    "paymentMethod": "credit_card"  // or debit_card, upi, wallet
}

Response (200):
{
    "success": true,
    "message": "Payment processed successfully",
    "data": {
        "payment": { ... },
        "booking": { ... }
    }
}
```

#### Get User Payments
```
GET /payments
Authorization: Bearer {token}
Query Parameters:
- status (optional): pending, completed, failed, refunded
```

#### Get Payment by ID
```
GET /payments/:id
Authorization: Bearer {token}
```

#### Refund Payment
```
POST /payments/:paymentId/refund
Authorization: Bearer {token}
```

## Data Models

### User
- `name`: string (required)
- `email`: string (required, unique)
- `phone`: string (required)
- `password`: string (required, hashed)
- `address`: string (required)
- `createdAt`: Date
- `updatedAt`: Date

### BikeType
- `name`: string (enum: Standard, Mountain, Electric, Road, Hybrid)
- `description`: string
- `hourlyRate`: number
- `monthlyRate`: number
- `createdAt`: Date
- `updatedAt`: Date

### Bike
- `name`: string
- `bikeTypeId`: ObjectId (reference to BikeType)
- `registrationNumber`: string (unique)
- `totalQuantity`: number
- `availableQuantity`: number
- `condition`: string (enum: Excellent, Good, Fair, Poor)
- `location`: string
- `isActive`: boolean
- `createdAt`: Date
- `updatedAt`: Date

### Booking
- `userId`: ObjectId (reference to User)
- `bikeId`: ObjectId (reference to Bike)
- `bookingType`: string (enum: hourly, monthly)
- `startDate`: Date
- `endDate`: Date
- `totalCost`: number
- `status`: string (enum: pending, confirmed, active, completed, cancelled)
- `quantity`: number
- `paymentId`: ObjectId (reference to Payment)
- `createdAt`: Date
- `updatedAt`: Date

### Payment
- `userId`: ObjectId (reference to User)
- `bookingId`: ObjectId (reference to Booking)
- `amount`: number
- `paymentMethod`: string (enum: credit_card, debit_card, upi, wallet)
- `paymentStatus`: string (enum: pending, completed, failed, refunded)
- `transactionId`: string
- `description`: string
- `createdAt`: Date
- `updatedAt`: Date

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error information"
}
```

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication errors)
- 403: Forbidden (authorization errors)
- 404: Not Found
- 500: Internal Server Error

## Security Features

✅ Password hashing with bcryptjs
✅ JWT-based authentication
✅ Protected routes with middleware
✅ Input validation
✅ CORS enabled
✅ Error handling for sensitive data

## Future Enhancements

- [ ] Real Stripe payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Reviews and ratings system
- [ ] Bike maintenance tracking
- [ ] Advanced analytics
- [ ] Mobile app support
- [ ] Real-time notifications

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.
2. Start the server:
   ```
   npm start
   ```
3. The server will be running on the specified port (default is 3000).

## Environment Variables

The following environment variables are required:

- `MONGODB_URI`: The connection string for your MongoDB database.
- `PORT`: The port on which the server will run (default is 3000).

## Folder Structure

```
backend-app
├── src
│   ├── app.ts               # Main application file
│   ├── server.ts            # Server startup file
│   ├── config               # Configuration files
│   │   └── database.ts      # Database connection configuration
│   ├── controllers          # Controller functions
│   │   └── index.ts         # Exports for controllers
│   ├── models               # Mongoose models
│   │   └── index.ts         # Exports for models
│   ├── routes               # Application routes
│   │   └── index.ts         # Route definitions
│   ├── middleware           # Middleware functions
│   │   └── index.ts         # Exports for middleware
│   └── types                # TypeScript types and interfaces
│       └── index.ts         # Exports for types
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── package.json             # NPM configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## License

This project is licensed under the MIT License.