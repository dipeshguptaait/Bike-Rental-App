import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import apiService from '../services/apiService';
import { Alert } from '../components/Common';
import { formatCurrency } from '../utils/formatting';

interface LocationState {
  booking: any;
  totalCost: number;
}

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'upi'>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const state = location.state as LocationState;

  if (!state || !state.booking) {
    return (
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Invalid payment session</p>
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

  const { booking, totalCost } = state;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Process payment
      await apiService.processPayment({
        bookingId: booking.id,
        amount: totalCost,
        paymentMethod,
        transactionId: `TXN-${Date.now()}`,
      });

      // Add to bookings store
      addBooking(booking);

      // Redirect to success
      navigate('/dashboard', {
        state: { success: 'Payment successful! Your booking is confirmed.' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

          {error && <Alert type="error" message={error} />}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-medium">{booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bike:</span>
                  <span className="font-medium">{booking.bikeId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{booking.bookingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{booking.quantity}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(totalCost)}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This is a demo payment system. Use test card: 4111 1111 1111 1111
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
                  <div className="space-y-2">
                    {(['credit_card', 'debit_card', 'upi'] as const).map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as typeof method)
                          }
                          className="mr-2"
                        />
                        {method === 'credit_card'
                          ? 'Credit Card'
                          : method === 'debit_card'
                          ? 'Debit Card'
                          : 'UPI'}
                      </label>
                    ))}
                  </div>
                </div>

                {['credit_card', 'debit_card'].includes(paymentMethod) && (
                  <>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardholderName}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardholderName: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value.replace(/\s/g, ''),
                          })
                        }
                        required
                        placeholder="4111 1111 1111 1111"
                        maxLength={16}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiryDate}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiryDate: e.target.value,
                            })
                          }
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          required
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">UPI ID</label>
                    <input
                      type="email"
                      placeholder="username@upi"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white py-3 rounded font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatCurrency(totalCost)}`}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your payment information is secure and encrypted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
