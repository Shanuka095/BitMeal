import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaReceipt, FaCheck, 
  FaUtensils, FaStar, FaTimesCircle, FaSearch, FaArrowRight, 
  FaBoxOpen, FaClock, FaCheckCircle, FaShoppingBag, FaBan 
} from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { Link, useNavigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';

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

            const ordersWithDetails = await Promise.all(response.data.map(async order => {
                if (order.status === 'delivered') {
                    if (!order.restaurantDetails) {
                        try {
                            const restaurantRes = await axios.get(`http://localhost:3000/api/restaurants/public/${order.restaurantId}`);
                            order.restaurantDetails = restaurantRes.data;
                        } catch (err) { console.warn('Restaurant fetch failed'); }
                    }
                    if (order.deliveryPersonId && !order.driverDetails) {
                        try {
                            const driverRes = await axios.get(`http://localhost:3000/api/delivery/${order.deliveryPersonId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            order.driverDetails = driverRes.data;
                        } catch (err) { console.warn('Driver fetch failed'); }
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

    // --- Stats Logic ---
    const totalOrders = orders.length;
    const activeCount = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length;
    const completedCount = orders.filter(o => o.status === 'delivered').length;
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

    // --- Filter Logic ---
    const filteredOrders = orders.filter(order => {
        if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
        if (filter === 'completed') return order.status === 'delivered';
        if (filter === 'cancelled') return order.status === 'cancelled';
        return true; 
    });

    // --- Helper: Status Badge ---
    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
            confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
            preparing: 'bg-purple-50 text-purple-600 border-purple-200',
            out_for_delivery: 'bg-orange-50 text-orange-600 border-orange-200',
            delivered: 'bg-green-50 text-green-600 border-green-200',
            cancelled: 'bg-red-50 text-red-600 border-red-200',
        };
        const icons = {
            pending: <FaClock className="mr-1.5" />,
            confirmed: <FaCheckCircle className="mr-1.5" />,
            preparing: <FaUtensils className="mr-1.5" />,
            out_for_delivery: <FaShoppingBag className="mr-1.5" />,
            delivered: <FaCheck className="mr-1.5" />,
            cancelled: <FaTimesCircle className="mr-1.5" />,
        };

        return (
            <span className={`flex items-center px-3 py-1 rounded-lg text-[10px] md:text-xs font-extrabold uppercase tracking-wider border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {icons[status]} {status.replace(/_/g, ' ')}
            </span>
        );
    };

    // --- Helper: Empty State Message ---
    const getEmptyMessage = () => {
        switch(filter) {
            case 'active': return "You don't have any active orders yet.";
            case 'completed': return "You haven't completed any orders yet.";
            case 'cancelled': return "You don't have any cancelled orders.";
            default: return "You haven't placed any orders yet.";
        }
    };

    if (loading) return <PageLoader />;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md border border-gray-100">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl animate-pulse">
                    <FaTimesCircle />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Connection Issue</h3>
                <p className="text-gray-500 mb-8 font-medium">{error}</p>
                <button onClick={fetchOrders} className="bg-[#ffaa00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e59400] transition shadow-lg transform hover:scale-105">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                
                {/* 1. Page Header & Stats */}
                <div className="mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-end animate-fade-in-down">
                    <div className="mb-6 lg:mb-0 w-full lg:w-auto text-center lg:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-600">Orders</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 font-medium">Track ongoing deliveries and order history.</p>
                    </div>
                    
                    {/* Stats Row - Mobile Optimized */}
                    <div className="flex space-x-3 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 hide-scrollbar px-1 snap-x snap-mandatory">
                        {[
                            { label: 'Total', count: totalOrders, icon: <FaBoxOpen />, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Active', count: activeCount, icon: <FaClock />, color: 'text-[#ffaa00]', bg: 'bg-orange-50' },
                            { label: 'Done', count: completedCount, icon: <FaCheckCircle />, color: 'text-green-500', bg: 'bg-green-50' },
                            { label: 'Void', count: cancelledCount, icon: <FaBan />, color: 'text-red-500', bg: 'bg-red-50' }
                        ].map((stat, i) => (
                            <div key={i} className="snap-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3 min-w-[130px] flex-shrink-0 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default">
                                <div className={`${stat.bg} p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-xl font-black text-gray-800">{stat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Filter Tabs */}
                <div className="sticky top-20 z-30 bg-[#fafafa]/95 backdrop-blur-md py-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 transition-all">
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                        {['all', 'active', 'completed', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize border outline-none focus:outline-none ${
                                    filter === f 
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform -translate-y-0.5' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-in-up">
                        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-4xl animate-bounce">
                            <FaSearch />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No {filter === 'all' ? '' : filter} orders found</h3>
                        <p className="text-gray-500 mb-8 font-medium">{getEmptyMessage()}</p>
                        <Link 
                            to="/restaurants" 
                            className="mt-10 inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-[#e59400] transition-all shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 outline-none focus:outline-none focus:ring-0"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => (
                            <div 
                                key={order._id} 
                                style={{ animationDelay: `${index * 0.1}s` }}
                                className="bg-white rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-500 border border-gray-100 group relative overflow-hidden animate-fade-in-up"
                            >
                                {/* Status Bar Accent */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                                    ${order.status === 'delivered' ? 'bg-green-500' : 
                                      order.status === 'cancelled' ? 'bg-red-500' : 'bg-[#ffaa00]'}`} 
                                />

                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pl-3">
                                    {/* Left: Meta Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <StatusBadge status={order.status} />
                                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                #{order._id.substring(0, 8)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-start space-x-4 mb-5">
                                            <div className="bg-gray-50 p-3.5 rounded-2xl text-[#ffaa00] block group-hover:scale-110 transition-transform duration-500">
                                                <FaReceipt size={20} className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base md:text-lg font-black text-gray-900 mb-1 group-hover:text-[#ffaa00] transition-colors duration-300 line-clamp-1">
                                                    {order.restaurantDetails?.name || 'Restaurant Order'}
                                                </h3>
                                                <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide flex items-center">
                                                    <FaCalendarAlt className="mr-2 text-gray-300" />
                                                    {format(new Date(order.orderDate), 'MMM d, yyyy')} • {format(new Date(order.orderDate), 'h:mm a')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mini Item Preview */}
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, i) => (
                                                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[10px] md:text-xs font-bold border border-gray-100 group-hover:border-gray-200 transition-colors">
                                                    <span className="text-[#ffaa00] mr-1.5">{item.quantity}x</span> {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Price & Actions - Mobile Optimized */}
                                    <div className="flex flex-col gap-4 border-t md:border-t-0 border-gray-100 pt-5 md:pt-0 min-w-[200px]">
                                        <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0 md:mb-1">Total Amount</p>
                                            <p className="text-xl md:text-2xl font-black text-gray-900">Rs. {order.totalAmount.toFixed(2)}</p>
                                        </div>

                                        <div className="flex flex-row gap-3 w-full">
                                            {order.status === 'delivered' && (
                                                !order.restaurantRated || (order.deliveryPersonId && !order.driverRated) ? (
                                                    <button
                                                        onClick={() => navigate(`/rate-order/${order._id}`, { state: { order } })}
                                                        className="flex-1 group px-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#ffaa00] hover:shadow-xl flex justify-center items-center gap-2 outline-none focus:outline-none"
                                                    >
                                                        <FaStar className="text-yellow-400 group-hover:rotate-[360deg] transition-transform duration-500" /> Rate
                                                    </button>
                                                ) : (
                                                    <div className="flex-1 px-4 py-2.5 bg-green-50 text-green-700 rounded-xl font-bold text-xs uppercase tracking-wide border border-green-100 flex justify-center items-center shadow-sm">
                                                        <FaCheck className="mr-2 bg-green-200 rounded-full p-1 text-green-800" size={16} /> Rated
                                                    </div>
                                                )
                                            )}
                                            
                                            {order.status !== 'cancelled' && (
                                                <button 
                                                    className="flex-1 px-4 py-3 bg-white text-gray-600 border-2 border-gray-100 rounded-xl font-bold text-xs uppercase tracking-wide hover:border-[#ffaa00] hover:text-[#ffaa00] transition-all transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center"
                                                    onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                                                >
                                                    Menu
                                                </button>
                                            )}
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