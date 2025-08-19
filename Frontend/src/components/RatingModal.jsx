import React, { useState, useEffect } from 'react';
import { FaTimes, FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const RatingModal = ({ isOpen, onClose, onSubmitRating, orderToRate }) => {
    const [restaurantRating, setRestaurantRating] = useState(0);
    const [driverRating, setDriverRating] = useState(0);
    const [restaurantLikeStatus, setRestaurantLikeStatus] = useState(null);
    const [driverLikeStatus, setDriverLikeStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRestaurantRating(0);
            setDriverRating(0);
            setRestaurantLikeStatus(null);
            setDriverLikeStatus(null);
            setSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const payload = {
            restaurantRating: orderToRate.restaurantRated ? null : restaurantRating,
            driverRating: orderToRate.driverRated ? null : driverRating,
            restaurantLikeStatus: orderToRate.restaurantRated ? null : restaurantLikeStatus,
            driverLikeStatus: orderToRate.driverRated ? null : driverLikeStatus,
        };

        if ((!orderToRate.restaurantRated && restaurantRating === 0) || (orderToRate.deliveryPersonId && !orderToRate.driverRated && driverRating === 0)) {
            alert('Please provide a star rating for all unrated parts of the order.');
            return;
        }

        setSubmitting(true);
        await onSubmitRating(payload, orderToRate._id);
        setSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                >
                    <FaTimes size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Rate Your Order</h2>
                
                {/* Restaurant Rating Section */}
                {!orderToRate.restaurantRated && (
                    <div className="mb-6 border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                            Restaurant: {orderToRate.restaurantDetails?.name || 'N/A'}
                        </h3>
                        <div className="flex justify-center items-center space-x-1 mb-2">
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={`res-star-${index}`}>
                                        <input
                                            type="radio"
                                            name="restaurantRating"
                                            value={currentRating}
                                            onClick={() => setRestaurantRating(currentRating)}
                                            className="hidden"
                                        />
                                        <FaStar
                                            className="cursor-pointer transition-colors duration-200"
                                            color={currentRating <= (restaurantRating) ? "#ffc107" : "#e4e5e9"}
                                            size={30}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                {/* Driver Rating Section */}
                {orderToRate.deliveryPersonId && !orderToRate.driverRated && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                            Driver: {orderToRate.driverDetails?.name || 'N/A'}
                        </h3>
                        <div className="flex justify-center items-center space-x-1 mb-2">
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={`drv-star-${index}`}>
                                        <input
                                            type="radio"
                                            name="driverRating"
                                            value={currentRating}
                                            onClick={() => setDriverRating(currentRating)}
                                            className="hidden"
                                        />
                                        <FaStar
                                            className="cursor-pointer transition-colors duration-200"
                                            color={currentRating <= (driverRating) ? "#ffc107" : "#e4e5e9"}
                                            size={30}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        {/* Like/Unlike buttons for driver */}
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                onClick={() => setDriverLikeStatus('liked')}
                                className={`p-2 rounded-full transition-colors duration-200 ${driverLikeStatus === 'liked' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-200'}`}
                            >
                                <FaThumbsUp size={24} />
                            </button>
                            <button
                                onClick={() => setDriverLikeStatus('disliked')}
                                className={`p-2 rounded-full transition-colors duration-200 ${driverLikeStatus === 'disliked' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-200'}`}
                            >
                                <FaThumbsDown size={24} />
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={submitting || (!orderToRate.restaurantRated && restaurantRating === 0)}
                    className="w-full bg-[#ffaa00] text-white p-3 rounded-lg hover:bg-[#e59400] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg mt-4"
                >
                    {submitting ? 'Submitting...' : 'Submit Ratings'}
                </button>
            </div>
        </div>
    );
};

export default RatingModal;
