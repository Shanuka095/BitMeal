import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaThumbsDown, FaArrowLeft, FaUtensils, FaMotorcycle } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';

const RateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [restaurantLikeStatus, setRestaurantLikeStatus] = useState(null);
  const [driverLikeStatus, setDriverLikeStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
          const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
          if (!token) {
            navigate('/login');
            return;
          }

          // Fetch all orders to find this one
          const response = await axios.get('http://localhost:3000/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const foundOrder = response.data.find(o => o._id === orderId);
          
          if (foundOrder) {
             // Fetch Restaurant Details if missing
             if (!foundOrder.restaurantDetails) {
                 const resRes = await axios.get(`http://localhost:3000/api/restaurants/public/${foundOrder.restaurantId}`);
                 foundOrder.restaurantDetails = resRes.data;
             }
             // Fetch Driver Details if missing
             if (foundOrder.deliveryPersonId && !foundOrder.driverDetails) {
                 const driverRes = await axios.get(`http://localhost:3000/api/delivery/${foundOrder.deliveryPersonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                 });
                 foundOrder.driverDetails = driverRes.data;
             }
             setOrder(foundOrder);
          } else {
            navigate('/my-orders');
          }
        } catch (err) {
          console.error(err);
          showAlert("Failed to load order details");
          navigate('/my-orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId, navigate, showAlert]);

  const handleSubmit = async () => {
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
    
    const payload = {
        restaurantRating: order.restaurantRated ? null : restaurantRating,
        driverRating: order.driverRated ? null : driverRating,
        restaurantLikeStatus: order.restaurantRated ? null : restaurantLikeStatus,
        driverLikeStatus: order.driverRated ? null : driverLikeStatus,
    };

    // Validation: Ensure user rated what they haven't rated yet
    if ((!order.restaurantRated && restaurantRating === 0) || 
        (order.deliveryPersonId && !order.driverRated && driverRating === 0)) {
        showAlert('Please provide a star rating before submitting.');
        return;
    }

    setSubmitting(true);
    try {
        await axios.post(`http://localhost:3000/api/orders/${orderId}/submit-rating`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showAlert('Feedback submitted successfully!');
        navigate('/my-orders');
    } catch (err) {
        showAlert(err.response?.data?.error || 'Failed to submit rating');
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading order details...</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <button 
            onClick={() => navigate('/my-orders')} 
            className="flex items-center text-gray-500 hover:text-[#ffaa00] transition mb-8 font-medium"
        >
            <FaArrowLeft className="mr-2" /> Back to Orders
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#ffaa00] to-[#ff8800] p-8 text-center text-white">
                <h1 className="text-3xl font-extrabold mb-2">How was your meal?</h1>
                <p className="text-orange-100 text-sm opacity-90">Order #{order._id.substring(0, 8).toUpperCase()}</p>
            </div>

            <div className="p-8 space-y-12">
                {/* Restaurant Section */}
                {!order.restaurantRated && (
                    <div className="text-center animate-fade-in-down">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-50 p-4 rounded-full">
                                <FaUtensils className="text-[#ffaa00] text-2xl" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {order.restaurantDetails?.name || 'The Restaurant'}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">Rate the food quality</p>
                        
                        <div className="flex justify-center items-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRestaurantRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <FaStar
                                        size={46}
                                        className={`transition-colors duration-200 ${
                                            star <= restaurantRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="h-6 text-sm font-medium text-[#ffaa00]">
                            {restaurantRating === 5 ? "Excellent!" : restaurantRating === 4 ? "Good" : restaurantRating === 3 ? "Average" : restaurantRating > 0 ? "Poor" : ""}
                        </div>
                    </div>
                )}

                {/* Driver Section */}
                {order.deliveryPersonId && !order.driverRated && (
                    <div className="text-center border-t border-gray-100 pt-10 animate-fade-in-down delay-100">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-50 p-4 rounded-full">
                                <FaMotorcycle className="text-blue-500 text-2xl" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {order.driverDetails?.name || 'Delivery Partner'}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">Rate the delivery service</p>
                        
                        <div className="flex justify-center items-center space-x-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setDriverRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <FaStar
                                        size={46}
                                        className={`transition-colors duration-200 ${
                                            star <= driverRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setDriverLikeStatus('liked')}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full border-2 transition font-medium ${
                                    driverLikeStatus === 'liked' 
                                    ? 'border-green-500 bg-green-50 text-green-600' 
                                    : 'border-gray-200 text-gray-500 hover:border-green-300'
                                }`}
                            >
                                <FaThumbsUp /> <span>Good Service</span>
                            </button>

                            <button
                                onClick={() => setDriverLikeStatus('disliked')}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-full border-2 transition font-medium ${
                                    driverLikeStatus === 'disliked' 
                                    ? 'border-red-500 bg-red-50 text-red-600' 
                                    : 'border-gray-200 text-gray-500 hover:border-red-300'
                                }`}
                            >
                                <FaThumbsDown /> <span>Issues</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || (!order.restaurantRated && restaurantRating === 0)}
                        className="w-full bg-[#ffaa00] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#e59400] hover:shadow-xl transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RateOrder;