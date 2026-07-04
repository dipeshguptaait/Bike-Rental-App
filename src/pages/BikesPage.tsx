import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBikeStore } from '../store/bikeStore';
import { useAuthStore } from '../store/authStore';
import { BikeCard, Loading, Alert } from '../components/Common';

export const BikesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { bikes, isLoading, error, fetchBikes, selectBike } = useBikeStore();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [filteredBikes, setFilteredBikes] = useState(bikes);

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setFilteredBikes(
        bikes.filter((bike) =>
          bike.location.toLowerCase().includes(selectedLocation.toLowerCase())
        )
      );
    } else {
      setFilteredBikes(bikes);
    }
  }, [bikes, selectedLocation]);

  const handleSelectBike = (bike: any) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    selectBike(bike);
    navigate('/booking');
  };

  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Browse Bikes</h1>

        {error && <Alert type="error" message={error} />}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Bikes</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Filter by location..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={() => setSelectedLocation('')}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Bikes Grid */}
        {isLoading ? (
          <Loading message="Loading bikes..." />
        ) : filteredBikes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No bikes available matching your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onSelectBike={handleSelectBike}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-gray-600">
          <p>Showing {filteredBikes.length} bikes</p>
        </div>
      </div>
    </main>
  );
};
