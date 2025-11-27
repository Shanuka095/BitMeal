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
import { useTheme } from '../context/ThemeContext'; // Theme Hook

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); 
    const { showAlert } = useModal();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
            // ... (Keep existing enrichment logic if needed, simplified here for brevity)
            setOrders(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch your orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const totalOrders = orders.length;
    const activeCount = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length;
    const completedCount = orders.filter(o => o.status === 'delivered').length;
    const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

    const filteredOrders = orders.filter(order => {
        if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status);
        if (filter === 'completed') return order.status === 'delivered';
        if (filter === 'cancelled') return order.status === 'cancelled';
        return true; 
    });

    const StatusBadge = ({ status }) => {
        const styles = isDark ? {
             pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
             confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
             preparing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
             out_for_delivery: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
             delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
             cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        } : {
             pending: 'bg-yellow-100 text-yellow-600 border-yellow-200',
             confirmed: 'bg-blue-100 text-blue-600 border-blue-200',
             preparing: 'bg-purple-100 text-purple-600 border-purple-200',
             out_for_delivery: 'bg-orange-100 text-orange-600 border-orange-200',
             delivered: 'bg-green-100 text-green-600 border-green-200',
             cancelled: 'bg-red-100 text-red-600 border-red-200',
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
            <span className={`flex items-center px-3 py-1 rounded-lg text-[10px] md:text-xs font-extrabold uppercase tracking-wider border ${styles[status] || (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}`}>
                {icons[status]} {status.replace(/_/g, ' ')}
            </span>
        );
    };

    if (loading) return <PageLoader />;
    if (error) return <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}><div className={`p-10 rounded-[2rem] shadow-xl text-center max-w-md border ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}><p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error}</p></div></div>;

    return (
        <div className={`min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-12 flex flex-col lg:flex-row justify-between items-end animate-fade-in-down">
                    <div className="mb-6 lg:mb-0">
                        <h1 className={`text-4xl font-black tracking-tight mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-600">Orders</span>
                        </h1>
                        <p className={`font-medium transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Track ongoing deliveries and order history.</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex space-x-3 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
                        {[
                            { label: 'Total', count: totalOrders, icon: <FaBoxOpen />, color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
                            { label: 'Active', count: activeCount, icon: <FaClock />, color: 'text-[#ffaa00]', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50' },
                            { label: 'Done', count: completedCount, icon: <FaCheckCircle />, color: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
                            { label: 'Void', count: cancelledCount, icon: <FaBan />, color: 'text-red-500', bg: isDark ? 'bg-red-500/10' : 'bg-red-50' }
                        ].map((stat, i) => (
                            <div key={i} className={`p-4 rounded-2xl shadow-sm border flex items-center space-x-3 min-w-[130px] group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
                                <div className={`${stat.bg} p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>{stat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className={`sticky top-20 z-30 backdrop-blur-md py-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 transition-all ${isDark ? 'bg-[#0f0f0f]/80' : 'bg-[#fafafa]/95'}`}>
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                        {['all', 'active', 'completed', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize border outline-none focus:outline-none ${
                                    filter === f 
                                    ? 'bg-[#ffaa00] text-black border-[#ffaa00] shadow-lg transform -translate-y-0.5' 
                                    : isDark 
                                        ? 'bg-[#1a1a1a] text-gray-400 border-white/10 hover:text-white hover:bg-white/5' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filteredOrders.length === 0 ? (
                    <div className={`text-center py-32 rounded-[3rem] shadow-sm border animate-fade-in-up ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-4xl animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                            <FaSearch />
                        </div>
                        <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No {filter === 'all' ? '' : filter} orders found</h3>
                        <p className={`mb-8 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nothing to see here yet.</p>
                        <Link 
                            to="/restaurants" 
                            className={`mt-10 inline-block px-10 py-3.5 rounded-2xl font-bold shadow-xl hover:shadow-orange-500/40 transition transform hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-[#ffaa00] hover:text-white' : 'bg-gray-900 text-white hover:bg-[#ffaa00]'}`}
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
                                className={`rounded-[2.5rem] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:scale-[1.01] transition-all duration-500 border group relative overflow-hidden animate-fade-in-up ${isDark ? 'bg-[#1a1a1a] border-white/5 hover:border-white/10' : 'bg-white border-gray-100'}`}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-[#ffaa00]'}`} />
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pl-3">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <StatusBadge status={order.status} />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>#{order._id.substring(0, 8)}</span>
                                        </div>
                                        
                                        <div className="flex items-start space-x-4 mb-5">
                                            <div className={`p-3.5 rounded-2xl text-[#ffaa00] hidden sm:block group-hover:scale-110 transition-transform duration-500 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                <FaReceipt size={20} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-black mb-1 group-hover:text-[#ffaa00] transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {order.restaurantDetails?.name || 'Restaurant Order'}
                                                </h3>
                                                <div className={`text-xs font-bold uppercase tracking-wide flex items-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    <FaCalendarAlt className="mr-2" />
                                                    {format(new Date(order.orderDate), 'MMM d, yyyy')} • {format(new Date(order.orderDate), 'h:mm a')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, i) => (
                                                <span key={i} className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDark ? 'bg-white/5 text-gray-300 border-white/5 group-hover:border-white/10' : 'bg-gray-50 text-gray-600 border-gray-100 group-hover:border-gray-200'}`}>
                                                    <span className="text-[#ffaa00] mr-1.5">{item.quantity}x</span> {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={`flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-5 border-t md:border-t-0 pt-5 md:pt-0 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <div className="text-right">
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Amount</p>
                                            <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Rs. {order.totalAmount.toFixed(2)}</p>
                                        </div>

                                        <div className="flex gap-3">
                                            {order.status !== 'cancelled' && (
                                                <button 
                                                    className={`px-5 py-3 border-2 rounded-xl font-bold text-xs uppercase tracking-wide hover:border-[#ffaa00] hover:text-[#ffaa00] transition-all transform hover:-translate-y-0.5 active:scale-95 ${isDark ? 'bg-transparent text-gray-300 border-white/10' : 'bg-white text-gray-600 border-gray-100'}`}
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