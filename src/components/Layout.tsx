import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Home, Bike, ShoppingCart } from 'lucide-react';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Bike size={32} />
            BikeRent
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-blue-100 transition"
            >
              <Home size={20} />
              Home
            </Link>

            <Link
              to="/bikes"
              className="flex items-center gap-1 hover:text-blue-100 transition"
            >
              <Bike size={20} />
              Browse Bikes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  className="flex items-center gap-1 hover:text-blue-100 transition"
                >
                  <ShoppingCart size={20} />
                  My Bookings
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-1 hover:text-blue-100 transition"
                  >
                    <User size={20} />
                    {user?.name}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-100 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BikeRent</h3>
            <p className="text-gray-400">
              Your premium bike rental service. Eco-friendly transportation made easy.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/bikes" className="hover:text-white transition">Browse Bikes</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@bikerent.com</p>
            <p className="text-gray-400">Phone: (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BikeRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
