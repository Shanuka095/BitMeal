import React, { useState, useEffect } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';

const RatingModal = ({ isOpen, onClose, onSubmitRating, restaurantName, orderId }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Reset rating when modal opens/closes
        if (isOpen) {
            setRating(0);
            setHover(0);
            setSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a star rating.'); // Using browser alert for simplicity in modal context
            return;
        }
        setSubmitting(true);
        await onSubmitRating(rating, orderId); // Pass rating and orderId to parent
        setSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    <FaTimes size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Rate {restaurantName}</h2>
                <p className="text-gray-700 text-center mb-4">How was your experience?</p>

                <div className="flex justify-center items-center space-x-1 mb-6">
                    {[...Array(5)].map((star, index) => {
                        const currentRating = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={currentRating}
                                    onClick={() => setRating(currentRating)}
                                    className="hidden"
                                />
                                <FaStar
                                    className="cursor-pointer transition-colors duration-200"
                                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={36}
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="w-full bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg"
                >
                    {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
