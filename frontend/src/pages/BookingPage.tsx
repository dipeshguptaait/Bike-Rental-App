import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikeStore } from '../store/bikeStore';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { Alert, Loading } from '../components/Common';
import { formatCurrency, calculateDuration } from '../utils/formatting';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedBike, clearSelection } = useBikeStore();
  const { createBooking, isLoading, error } = useBookingStore();
  const [bookingType, setBookingType] = useState<'hourly' | 'monthly'>('hourly');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Recalculate cost whenever dates, times, quantity, or booking type changes
  useEffect(() => {
    if (!startDate || !endDate || !startTime || !endTime || isNaN(quantity) || quantity < 1) {
      setTotalCost(0);
      return;
    }

    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        setTotalCost(0);
        return;
      }

      const duration = calculateDuration(start, end, bookingType);
      if (duration <= 0) {
        setTotalCost(0);
        return;
      }

      const rate =
        bookingType === 'hourly'
          ? selectedBike?.bikeType?.hourlyRate || 10
          : selectedBike?.bikeType?.monthlyRate || 100;

      const cost = duration * rate * quantity;
      setTotalCost(isNaN(cost) ? 0 : cost);
    } catch (err) {
      console.error('Error calculating cost:', err);
      setTotalCost(0);
    }
  }, [startDate, startTime, endDate, endTime, quantity, bookingType, selectedBike]);

  if (!selectedBike) {
    return (
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No bike selected</p>
            <button
              onClick={() => navigate('/bikes')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Bikes
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    console.log('Form submission:', { startDate, endDate, startTime, endTime, quantity, bookingType });

    // Field validation - check for empty strings
    if (!startDate) {
      setValidationError('Start date is required');
      return;
    }
    if (!startTime) {
      setValidationError('Start time is required');
      return;
    }
    if (!endDate) {
      setValidationError('End date is required');
      return;
    }
    if (!endTime) {
      setValidationError('End time is required');
      return;
    }
    if (isNaN(quantity) || quantity < 1) {
      setValidationError('Quantity must be at least 1');
      return;
    }

    // Validate date/time logic
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    console.log('Parsed dates:', { start: start.toISOString(), end: end.toISOString() });

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setValidationError('Invalid date or time format');
      return;
    }

    if (end <= start) {
      setValidationError('End date/time must be after start date/time');
      return;
    }

    // Calculate duration
    const duration = calculateDuration(start, end, bookingType);
    
    console.log('Duration:', duration);

    if (duration <= 0) {
      setValidationError('Booking duration must be at least 1 hour');
      return;
    }

    try {
      console.log('Creating booking...');
      const booking = await createBooking({
        bikeId: selectedBike.id,
        bookingType,
        startDate: `${startDate}T${startTime}`,
        endDate: `${endDate}T${endTime}`,
        quantity,
      });

      console.log('Booking created:', booking);

      // Calculate cost for display on payment page
      const rate =
        bookingType === 'hourly'
          ? selectedBike.bikeType?.hourlyRate || 10
          : selectedBike.bikeType?.monthlyRate || 100;
      const finalTotalCost = duration * rate * quantity;

      console.log('Final cost:', finalTotalCost);

      navigate('/payment', { state: { booking, totalCost: finalTotalCost } });
    } catch (err: any) {
      console.error('Booking error:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create booking. Please try again.';
      setValidationError(errorMsg);
    }
  };

  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Book Your Bike</h1>

          {error && <Alert type="error" message={error} />}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bike Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedBike.name}</h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>Registration:</strong> {selectedBike.registrationNumber}</p>
                <p><strong>Location:</strong> {selectedBike.location}</p>
                <p><strong>Condition:</strong> {selectedBike.condition}</p>
                <p><strong>Available:</strong> {selectedBike.availableQuantity}</p>
              </div>

              <button
                onClick={() => {
                  clearSelection();
                  navigate('/bikes');
                }}
                className="w-full mt-6 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
              >
                Change Bike
              </button>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {(validationError || error) && (
                  <Alert
                    type="error"
                    message={validationError || error || ''}
                    onClose={() => setValidationError(null)}
                  />
                )}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Booking Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="hourly"
                        checked={bookingType === 'hourly'}
                        onChange={(e) => setBookingType(e.target.value as 'hourly')}
                        className="mr-2"
                      />
                      Hourly
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="monthly"
                        checked={bookingType === 'monthly'}
                        onChange={(e) => setBookingType(e.target.value as 'monthly')}
                        className="mr-2"
                      />
                      Monthly
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedBike.availableQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : 1;
                      setQuantity(Math.max(1, isNaN(val) ? 1 : val));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {totalCost > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-gray-600 mb-2">Total Cost:</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(totalCost)}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !startDate || !endDate || !startTime || !endTime}
                  className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Creating Booking...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
