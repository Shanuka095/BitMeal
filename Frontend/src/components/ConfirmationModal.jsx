import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in-up">
        <div className="flex flex-col items-center space-y-4">
          <FaQuestionCircle className="text-yellow-500 text-5xl" />
          <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Action</h3>
          <p className="text-gray-700 text-center">{message}</p>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
