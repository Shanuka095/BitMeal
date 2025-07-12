import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const PromptModal = ({ title, message, placeholder, onConfirm, onCancel }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <div className="flex flex-col items-center space-y-4">
          <FaEdit className="text-blue-500 text-5xl" />
          <h3 className="text-xl font-semibold text-gray-800 text-center">{title}</h3>
          <p className="text-gray-700 text-center">{message}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          />
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleConfirm}
              className="bg-[#ffaa00] text-white px-6 py-2 rounded-lg hover:bg-[#e59400] transition font-semibold shadow-md"
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

export default PromptModal;
