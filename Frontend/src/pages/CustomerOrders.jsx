import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaReceipt, FaCheck, 
  FaUtensils, FaStar, FaTimesCircle 
} from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { Link, useNavigate } from 'react-router-dom';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const { showAlert } = useModal();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
        const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/api/orders/my-orders', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Enrich delivered orders with details for rating
            const ordersWithDetails = await Promise.all(response.data.map(async order => {
                if (order.status === 'delivered') {
                    // Fetch Restaurant Details
                    if (!order.restaurantDetails) {
                        try {
                            const restaurantRes = await axios.get(`http://localhost:3000/api/restaurants/public/${order.restaurantId}`);
                            order.restaurantDetails = restaurantRes.data;
                        } catch (err) {
                            console.warn(`Could not fetch restaurant for order ${order._id}`);
                        }
                    }
                    
                    // Fetch Driver Details - FIXED: Added Authorization Header
                    if (order.deliveryPersonId && !order.driverDetails) {
                        try {
                            const driverRes = await axios.get(`http://localhost:3000/api/delivery/${order.deliveryPersonId}`, {
                                headers: { Authorization: `Bearer ${token}` } // <--- FIX FOR 401 ERROR
                            });
                            order.driverDetails = driverRes.data;
                        } catch (err) {
                            console.warn(`Could not fetch driver for order ${order._id}`, err.response?.status);
                        }
                    }
                }
                return order;
            }));

            setOrders(ordersWithDetails);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch your orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // --- Helper Components ---
    const OrderStatusStepper = ({ status }) => {
        const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        const currentStepIndex = steps.indexOf(status);
        
        if (status === 'cancelled') {
            return (
                <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                    <FaTimesCircle className="mr-2" /> 
                    <span className="font-semibold">Order Cancelled</span>
                </div>
            );
        }

        return (
            <div className="w-full py-4">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-0"></div>
                    <div 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 rounded-full -z-0 transition-all duration-500"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center group">
                                <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        isCompleted ? 'bg-green-500 border-green-500 text-white scale-110' : 'bg-white border-gray-300 text-gray-300'
                                    }`}
                                >
                                    {isCompleted ? <FaCheck size={12} /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                                </div>
                                <span className={`hidden md:block absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                                    index === currentStepIndex ? 'text-green-700 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                                }`}>
                                    {step.replace(/_/g, ' ')}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="md:hidden mt-2 text-center text-sm font-semibold text-green-700 capitalize">
                   Status: {status.replace(/_/g, ' ')}
                </div>
            </div>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
        if (filter === 'completed') return ['delivered', 'cancelled'].includes(order.status);
        return true;
    });

    if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><p className="text-gray-600 font-medium">Loading orders...</p></div>;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <div className="text-red-500 text-5xl mb-4 flex justify-center"><FaTimesCircle /></div>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={fetchOrders} className="bg-[#ffaa00] text-white px-6 py-2 rounded-full hover:bg-[#e59400] transition font-semibold">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">My Orders</h1>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="bg-white p-1 rounded-full shadow-md inline-flex relative">
                        {['all', 'active', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 capitalize z-10 relative ${
                                    filter === f ? 'bg-[#ffaa00] text-white shadow-sm' : 'text-gray-500 hover:text-[#ffaa00]'
                                }`}
                            >
                                {f === 'all' ? 'All Orders' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaUtensils className="text-[#ffaa00] text-4xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
                        <Link to="/restaurants" className="px-8 py-3 bg-[#ffaa00] text-white rounded-full font-bold shadow-lg hover:bg-[#e59400] transition mt-4 inline-block">Browse Menu</Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm"><FaReceipt className="text-[#ffaa00]" /></div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Order ID</p>
                                            <p className="text-gray-900 font-bold">#{order._id.substring(0, 8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm mt-2 sm:mt-0">
                                        <FaCalendarAlt className="mr-2 text-gray-400" />
                                        {format(new Date(order.orderDate), 'PPP p')}
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center"><FaUtensils className="mr-2 text-[#ffaa00] opacity-70" /> Items</h4>
                                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                                            <div className="flex items-center">
                                                                <span className="font-bold text-gray-800 mr-2">{item.quantity}x</span>
                                                                <span className="text-gray-700">{item.name}</span>
                                                                {item.size && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2">{item.size}</span>}
                                                            </div>
                                                            <span className="font-medium text-gray-600">Rs. {item.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <FaMapMarkerAlt className="mt-1 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Delivery Address</p>
                                                    <p className="text-sm leading-relaxed">{order.deliveryAddress || "Location pinned on map"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between border-l border-gray-100 pl-0 lg:pl-8 lg:border-t-0 border-t pt-6 lg:pt-0">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Status</h4>
                                                <OrderStatusStepper status={order.status} />
                                            </div>

                                            <div className="mt-8">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-gray-500 font-medium">Total Amount</span>
                                                    <span className="text-3xl font-extrabold text-[#ffaa00]">Rs. {order.totalAmount.toFixed(2)}</span>
                                                </div>
                                                
                                                <div className="mt-6 space-y-3">
                                                    {order.status === 'delivered' && (
                                                        !order.restaurantRated || (order.deliveryPersonId && !order.driverRated) ? (
                                                            <button
                                                                onClick={() => navigate(`/rate-order/${order._id}`, { state: { order } })}
                                                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 transition flex items-center justify-center"
                                                            >
                                                                <FaStar className="mr-2 text-yellow-400" /> Rate Order
                                                            </button>
                                                        ) : (
                                                            <div className="w-full bg-green-100 text-green-800 py-3 rounded-xl font-bold flex items-center justify-center border border-green-200">
                                                                <FaCheck className="mr-2" /> Rating Submitted
                                                            </div>
                                                        )
                                                    )}
                                                    
                                                    <button 
                                                        className="w-full bg-orange-50 text-[#ffaa00] py-3 rounded-xl font-bold border-2 border-transparent hover:border-[#ffaa00] transition"
                                                        onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                                                    >
                                                        View Restaurant
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;