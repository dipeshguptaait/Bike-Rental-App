import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Alert, Loading } from '../components/Common';
import { formatCurrency, getStatusColor, formatDate } from '../utils/formatting';
import { Trash2, Eye } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, isLoading, fetchUserBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
  }, [isAuthenticated]);

  const state = location.state as { success?: string } | null;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {state?.success && <Alert type="success" message={state.success} />}

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{user?.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {user?.createdAt ? formatDate(new Date(user.createdAt)) : 'Recently'}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {isLoading ? (
          <Loading message="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/bikes')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Bikes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-bold">{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bike</p>
                    <p className="font-medium">{booking.bikeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{booking.bookingType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`font-bold px-3 py-1 rounded text-white text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-gray-600 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm">Start: {formatDate(new Date(booking.startDate))}</p>
                    <p className="text-sm">End: {formatDate(new Date(booking.endDate))}</p>
                  </div>
                  <div>
                    <p className="text-sm">Quantity: {booking.quantity}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      {booking.totalCost ? formatCurrency(booking.totalCost) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/booking-details/${booking.id}`)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to cancel this booking?'
                          )
                        ) {
                          cancelBooking(booking.id);
                        }
                      }}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
