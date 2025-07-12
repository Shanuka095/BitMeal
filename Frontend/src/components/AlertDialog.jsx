import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const AlertDialog = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in-up">
        <div className="flex flex-col items-center space-y-4">
          <FaInfoCircle className="text-blue-500 text-5xl" />
          <h3 className="text-xl font-semibold text-gray-800 text-center">Information</h3>
          <p className="text-gray-700 text-center">{message}</p>
          <button
            onClick={onClose}
            className="bg-[#ffaa00] text-white px-6 py-2 rounded-lg hover:bg-[#e59400] transition font-semibold shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
