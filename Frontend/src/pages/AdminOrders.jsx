import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import PageLoader from '../components/PageLoader';

const AdminOrders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { showAlert } = useModal();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch Admin Restaurants
  useEffect(() => {
    const fetchAdminRestaurants = async () => {
      setLoading(true);
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3003/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedRestaurantId(data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminRestaurants();
  }, []);

  // Fetch Orders
  const fetchOrders = async () => {
    if (!selectedRestaurantId) return;
    setLoading(true);
    const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
    const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

    try {
      const response = await axios.get(`http://localhost:3000/api/orders/restaurant/${selectedRestaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedRestaurantId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert('Status updated successfully!');
      fetchOrders();
    } catch (err) {
      showAlert('Failed to update status.');
    }
  };

  // Theme Classes
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100';
  const selectBg = isDark ? 'bg-[#2a2a2a] text-white border-white/10' : 'bg-white text-gray-900 border-gray-300';

  if (loading && restaurants.length === 0) return <PageLoader />;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className={`text-3xl font-black ${textMain}`}>Manage Orders</h1>
            <p className={`text-sm ${textSub}`}>Update order status to notify drivers.</p>
        </div>
        
        {restaurants.length > 0 && (
          <div className="w-full md:w-auto">
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className={`w-full md:w-64 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#ffaa00] font-bold text-sm ${selectBg}`}
            >
              {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className={`p-16 rounded-[2.5rem] text-center border-2 border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                <FaBox />
            </div>
            <h3 className={`text-lg font-bold ${textMain}`}>No Orders Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className={`p-6 rounded-[2rem] border shadow-sm ${cardBg}`}>
              
              {/* Card Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-dashed border-gray-200 dark:border-white/10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 rounded-lg bg-[#ffaa00]/10 text-[#ffaa00] text-[10px] font-bold uppercase tracking-wider">
                            #{order._id.substring(0, 8)}
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                            <FaClock size={10} /> {format(new Date(order.orderDate), 'MMM d, h:mm a')}
                        </span>
                    </div>
                    <h3 className={`text-lg font-bold ${textMain}`}>Rs. {order.totalAmount.toFixed(2)}</h3>
                </div>
                
                {/* Status Badge */}
                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {order.status === 'delivered' ? <FaCheckCircle /> : <FaClock />}
                    {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                        <div className={`flex items-center gap-3 ${textMain}`}>
                            <span className="font-bold text-[#ffaa00]">{item.quantity}x</span>
                            <span>{item.name} <span className={`text-xs ${textSub}`}>{item.size === 'full' ? '(Full)' : ''}</span></span>
                        </div>
                        <span className={`font-bold ${textSub}`}>Rs. {item.price}</span>
                    </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${textSub}`}>Delivery To</p>
                    <p className={`text-sm font-bold ${textMain} line-clamp-2`}>{order.deliveryAddress}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textSub}`}>Update Status</label>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`w-full p-3 rounded-xl border font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#ffaa00] ${selectBg}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
              </div>

              {/* Assigned Driver Info */}
              {order.deliveryPersonId ? (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-500">
                      <FaCheckCircle /> Driver Accepted
                  </div>
              ) : (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#ffaa00]">
                      <FaClock /> Waiting for Driver
                  </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;