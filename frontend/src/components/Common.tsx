import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const bgColor = {
    error: 'bg-red-100',
    success: 'bg-green-100',
    info: 'bg-blue-100',
  }[type];

  const textColor = {
    error: 'text-red-800',
    success: 'text-green-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  }[type];

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center gap-3 mb-4`}>
      <Icon size={20} />
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto font-bold hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
};

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

interface BikeCardProps {
  bike: any;
  onSelectBike: (bike: any) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onSelectBike }) => {
  const conditionColor = {
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
  };

  // Fallback values for missing fields
  const bikeName = bike?.name || 'Bike';
  const registrationNumber = bike?.registrationNumber || bike?.regNo || 'N/A';
  const location = bike?.location || 'Not Specified';
  const availableQuantity = bike?.availableQuantity !== undefined ? bike.availableQuantity : bike?.available || 0;
  const totalQuantity = bike?.totalQuantity !== undefined ? bike.totalQuantity : bike?.total || 1;
  const condition = bike?.condition || 'Good';
  const isActive = bike?.isActive !== undefined ? bike.isActive : true;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{bikeName}</h3>
        <p className="text-gray-600 text-sm">Reg ID: <span className="font-medium">{registrationNumber}</span></p>
      </div>

      <div className="space-y-3 mb-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">📍 Location:</span>
          <span className="font-medium text-gray-800">{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">🚲 Available:</span>
          <span className="font-medium text-gray-800">{availableQuantity} / {totalQuantity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Condition:</span>
          <span className={`px-3 py-1 rounded text-xs font-medium ${conditionColor[condition as keyof typeof conditionColor] || 'bg-gray-100 text-gray-800'}`}>
            {condition}
          </span>
        </div>
      </div>

      <button
        onClick={() => onSelectBike(bike)}
        disabled={availableQuantity === 0 || !isActive}
        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {availableQuantity === 0 || !isActive ? 'Not Available' : 'Book Now'}
      </button>
    </div>
  );
};
