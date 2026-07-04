import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bike, Zap, Shield } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to BikeRent</h1>
          <p className="text-xl mb-8 text-blue-100">
            Rent eco-friendly bikes for your city adventures
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/bikes' : '/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose BikeRent?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Bike size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Wide Selection</h3>
              <p className="text-gray-600">
                Choose from our collection of standard, mountain, electric, and road bikes
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Zap size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Affordable Pricing</h3>
              <p className="text-gray-600">
                Hourly and monthly plans to suit your needs and budget
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Shield size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-gray-600">
                Well-maintained bikes with secure payment processing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
          <p className="text-blue-100 mb-8">
            Browse our available bikes and book your next adventure
          </p>
          <button
            onClick={() => navigate('/bikes')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            Browse Bikes Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-5xl font-bold text-blue-600">500+</h3>
              <p className="text-gray-600 mt-2">Bikes Available</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-blue-600">10K+</h3>
              <p className="text-gray-600 mt-2">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold text-blue-600">50+</h3>
              <p className="text-gray-600 mt-2">Locations</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
