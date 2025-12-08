import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaReceipt, FaCheck, 
  FaUtensils, FaStar, FaTimesCircle, FaSearch, FaArrowRight, 
  FaBoxOpen, FaClock, FaCheckCircle, FaShoppingBag, FaBan,
  // Background icons preserved
  FaPizzaSlice, FaHamburger, FaIceCream, FaLeaf, FaPepperHot
} from 'react-icons/fa';
import { GiDonut, GiChickenLeg } from 'react-icons/gi';
import { useModal } from '../context/ModalContext';
import { Link, useNavigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext'; 

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

    const getEmptyMessage = () => {
        switch(filter) {
            case 'active': return "You don't have any active orders yet.";
            case 'completed': return "You haven't completed any orders yet.";
            case 'cancelled': return "You don't have any cancelled orders.";
            default: return "You haven't placed any orders yet.";
        }
    };

    // --- Helper to determine Card Hover Styles based on Status ---
    const getCardHoverStyles = (status) => {
        if (status === 'cancelled') {
            return isDark 
                ? 'hover:shadow-[0_15px_40px_-10px_rgba(239,68,68,0.3)] hover:border-red-500/40' 
                : 'hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.25)] hover:border-red-200';
        }
        if (status === 'delivered') {
            return isDark 
                ? 'hover:shadow-[0_15px_40px_-10px_rgba(34,197,94,0.3)] hover:border-green-500/40' 
                : 'hover:shadow-[0_20px_40px_-10px_rgba(34,197,94,0.25)] hover:border-green-200';
        }
        // Active (Pending, Preparing, etc.) - Yellow/Gold
        return isDark 
            ? 'hover:shadow-[0_15px_40px_-10px_rgba(234,179,8,0.3)] hover:border-yellow-500/40' 
            : 'hover:shadow-[0_20px_40px_-10px_rgba(234,179,8,0.25)] hover:border-yellow-200';
    };

    if (loading) return <PageLoader />;
    if (error) return <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]'}`}><div className={`p-10 rounded-[2rem] shadow-xl text-center max-w-md border ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}><p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error}</p></div></div>;

    // --- STATS CONFIGURATION (With Advanced Hover Effects) ---
    const statsData = [
        { 
            label: 'Total', count: totalOrders, icon: <FaBoxOpen />, 
            color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', 
            hoverClasses: isDark 
                ? 'hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] hover:bg-blue-500/5' 
                : 'hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100'
        },
        { 
            label: 'Active', count: activeCount, icon: <FaClock />, 
            color: 'text-[#ffaa00]', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
            hoverClasses: isDark
                ? 'hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(255,170,0,0.2)] hover:bg-orange-500/5'
                : 'hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100'
        },
        { 
            label: 'Done', count: completedCount, icon: <FaCheckCircle />, 
            color: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50',
            hoverClasses: isDark
                ? 'hover:border-green-500/50 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] hover:bg-green-500/5'
                : 'hover:border-green-200 hover:shadow-lg hover:shadow-green-100'
        },
        { 
            label: 'Void', count: cancelledCount, icon: <FaBan />, 
            color: 'text-red-500', bg: isDark ? 'bg-red-500/10' : 'bg-red-50',
            hoverClasses: isDark
                ? 'hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:bg-red-500/5'
                : 'hover:border-red-200 hover:shadow-lg hover:shadow-red-100'
        }
    ];

    return (
        <div className={`min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-x-hidden ${isDark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
            
            {/* --- BACKGROUND ANIMATION (PRESERVED) --- */}
            <style>{`
                @keyframes drift {
                0% { transform: translate(0, 0) rotate(0deg); }
                33% { transform: translate(30px, -30px) rotate(10deg); }
                66% { transform: translate(-20px, 20px) rotate(-5deg); }
                100% { transform: translate(0, 0) rotate(0deg); }
                }
                .animate-drift-slow { animation: drift 20s ease-in-out infinite; }
                .animate-drift-medium { animation: drift 15s ease-in-out infinite; }
                .animate-drift-fast { animation: drift 12s ease-in-out infinite; }
            `}</style>

            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <FaPizzaSlice className={`absolute text-6xl animate-drift-slow top-32 left-[5%] ${isDark ? 'text-white/5' : 'text-orange-500/10'}`} />
                <FaHamburger className={`absolute text-9xl animate-drift-medium bottom-20 right-[5%] ${isDark ? 'text-white/5' : 'text-[#ffaa00]/10'}`} style={{ animationDelay: '1s' }} />
                <FaIceCream className={`absolute text-5xl animate-drift-fast top-[50%] right-[15%] ${isDark ? 'text-white/5' : 'text-pink-500/10'}`} style={{ animationDelay: '2s' }} />
                <GiDonut className={`absolute text-8xl animate-drift-slow bottom-[30%] left-[8%] ${isDark ? 'text-white/5' : 'text-purple-500/10'}`} style={{ animationDelay: '3s' }} />
                <GiChickenLeg className={`absolute text-7xl animate-drift-medium top-40 right-[25%] ${isDark ? 'text-white/5' : 'text-red-500/10'}`} style={{ animationDelay: '4s' }} />
                <FaLeaf className={`absolute text-4xl animate-drift-fast top-[20%] left-[40%] ${isDark ? 'text-white/5' : 'text-green-500/10'}`} style={{ animationDelay: '0.5s' }} />
                <FaPepperHot className={`absolute text-6xl animate-drift-slow top-[60%] left-[2%] ${isDark ? 'text-white/5' : 'text-red-600/10'}`} style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="mb-12 flex flex-col lg:flex-row justify-between items-end animate-fade-in-down">
                    <div className="mb-6 lg:mb-0">
                        <h1 className={`text-4xl font-black tracking-tight mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-orange-600">Orders</span>
                        </h1>
                        <p className={`font-medium transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Track ongoing deliveries and order history.</p>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex space-x-3 w-full lg:w-auto overflow-x-auto pb-8 pt-4 px-2 lg:pb-4 hide-scrollbar">
                        {statsData.map((stat, i) => (
                            <div 
                                key={i} 
                                className={`
                                    p-4 rounded-2xl shadow-sm border flex items-center space-x-3 min-w-[130px] cursor-default group transition-all duration-500 ease-out
                                    ${isDark ? 'bg-[#1a1a1a]/80 border-white/5 backdrop-blur-sm' : 'bg-white/90 border-gray-100'}
                                    hover:-translate-y-2 ${stat.hoverClasses}
                                `}
                            >
                                <div className={`${stat.bg} p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                                    <p className={`text-xl font-black transition-colors duration-300 ${isDark ? 'text-white group-hover:text-gray-100' : 'text-gray-800 group-hover:text-black'}`}>{stat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className={`sticky top-20 z-30 backdrop-blur-md py-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 transition-all ${isDark ? 'bg-[#0f0f0f]/80' : 'bg-[#fafafa]/80'}`}>
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
                        {['all', 'active', 'completed', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize border outline-none focus:outline-none ${
                                    filter === f 
                                    ? 'bg-[#ffaa00] text-black border-[#ffaa00] shadow-lg transform -translate-y-0.5' 
                                    : isDark 
                                        ? 'bg-[#1a1a1a]/80 text-gray-400 border-white/10 hover:text-white hover:bg-white/5' 
                                        : 'bg-white/90 text-gray-500 border-gray-200 hover:text-gray-700 hover:shadow-sm'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filteredOrders.length === 0 ? (
                    <div className={`text-center py-32 rounded-[3rem] shadow-sm border animate-fade-in-up ${isDark ? 'bg-[#1a1a1a]/80 border-white/5' : 'bg-white/90 border-gray-100'}`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ffaa00] text-4xl animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                            <FaSearch />
                        </div>
                        <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No {filter === 'all' ? '' : filter} orders found</h3>
                        <p className={`mb-8 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{getEmptyMessage()}</p>
                        <Link 
                            to="/restaurants" 
                            className={`mt-10 inline-block px-10 py-3.5 rounded-2xl font-bold shadow-xl hover:shadow-orange-500/40 transition transform hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-[#ffaa00] hover:text-white' : 'bg-gray-900 text-white hover:bg-[#ffaa00]'}`}
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => {
                            const cardHoverStyle = getCardHoverStyles(order.status);
                            
                            return (
                                <div 
                                    key={order._id} 
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    className={`
                                        rounded-[2.5rem] p-6 md:p-8 shadow-sm transition-all duration-500 border group relative overflow-hidden animate-fade-in-up
                                        hover:-translate-y-2 hover:scale-[1.01] ${cardHoverStyle}
                                        ${isDark ? 'bg-[#1a1a1a]/90 border-white/5 backdrop-blur-sm' : 'bg-white/90 border-gray-100'}
                                    `}
                                >
                                    {/* Status Bar Accent */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2 ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-[#ffaa00]'}`} />
                                    
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
                                                        <FaCalendarAlt className="mr-2 text-gray-300" />
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

                                        <div className={`flex flex-col gap-4 border-t md:border-t-0 pt-5 md:pt-0 min-w-[200px] ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                            <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full">
                                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-0 md:mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Amount</p>
                                                <p className={`text-xl md:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Rs. {order.totalAmount.toFixed(2)}</p>
                                            </div>

                                            <div className="flex flex-row gap-3 w-full">
                                                {/* RATE BUTTON */}
                                                {order.status === 'delivered' && (
                                                    !order.restaurantRated || (order.deliveryPersonId && !order.driverRated) ? (
                                                        <button
                                                            onClick={() => navigate(`/rate-order/${order._id}`, { state: { order } })}
                                                            className="flex-1 group/btn px-4 py-3 bg-[#ffaa00] text-white rounded-xl font-bold text-xs uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-orange-500/40 flex justify-center items-center gap-2 outline-none focus:outline-none"
                                                        >
                                                            <FaStar className="text-white group-hover/btn:rotate-[360deg] transition-transform duration-500" /> Rate
                                                        </button>
                                                    ) : (
                                                        <div className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide border flex justify-center items-center shadow-sm ${isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                                            <FaCheck className="mr-2" size={14} /> Rated
                                                        </div>
                                                    )
                                                )}
                                                
                                                {/* VIEW MENU BUTTON */}
                                                {order.status !== 'cancelled' && (
                                                    <button 
                                                        className={`flex-1 px-4 py-3 border-2 rounded-xl font-bold text-xs uppercase tracking-wide transition-all transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center ${isDark ? 'bg-transparent text-gray-300 border-white/10 hover:border-[#ffaa00] hover:text-[#ffaa00]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#ffaa00] hover:text-[#ffaa00]'}`}
                                                        onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                                                    >
                                                        View Menu
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;