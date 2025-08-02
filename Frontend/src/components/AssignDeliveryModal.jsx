import React, { useState } from 'react';
import { FaTimes, FaMotorcycle } from 'react-icons/fa';

const AssignDeliveryModal = ({ isOpen, onClose, onAssign, order, drivers }) => {
  const [selectedDriverId, setSelectedDriverId] = useState('');

  if (!isOpen || !order) return null;

  const handleAssign = () => {
    if (!selectedDriverId) {
      alert('Please select a driver.');
      return;
    }
    onAssign(selectedDriverId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Assign Delivery Person</h2>
        <p className="text-gray-700 mb-2"><strong>Order ID:</strong> {order._id.substring(0, 8)}</p>
        <p className="text-gray-700 mb-4"><strong>Total:</strong> Rs. {order.totalAmount.toFixed(2)}</p>

        <div className="mb-4">
          <label htmlFor="driver-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select an Available Driver:
          </label>
          <select
            id="driver-select"
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          >
            <option value="">-- Select Driver --</option>
            {drivers.filter(d => d.status === 'available').map(driver => (
              <option key={driver._id} value={driver._id}>
                {driver.name} ({driver.vehicleType})
              </option>
            ))}
          </select>
        </div>

        {drivers.filter(d => d.status === 'available').length === 0 && (
          <p className="text-sm text-red-500 text-center">No available drivers found.</p>
        )}

        <button
          onClick={handleAssign}
          disabled={!selectedDriverId}
          className="w-full mt-4 bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md"
        >
          Assign Delivery Person
        </button>
      </div>
    </div>
  );
};

export default AssignDeliveryModal;