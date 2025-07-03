import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSyncAlt } from 'react-icons/fa';

const AdminOrders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchAdminRestaurants = async () => {
      setLoading(true);
      setError('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      console.log('Frontend (AdminOrders) - Fetching admin restaurants with token:', token.substring(0, 10) + '...');
      try {
        const response = await axios.get('http://localhost:3000/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedRestaurantId(data[0]._id);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch your restaurants.';
        setError(errorMessage);
        console.error('Frontend (AdminOrders) - Fetch restaurants error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminRestaurants();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedRestaurantId) {
        setOrders([]);
        if (!loading) setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setUpdateMessage('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      console.log('Frontend (AdminOrders) - Fetching orders for restaurant:', selectedRestaurantId, 'with token:', token.substring(0, 10) + '...');
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/restaurant/${selectedRestaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch orders for this restaurant.';
        setError(errorMessage);
        console.error('Frontend (AdminOrders) - Fetch orders error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedRestaurantId]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdateMessage('');
    try {
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
      if (!token) {
        setUpdateMessage('Error: No authentication token.');
        return;
      }

      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setUpdateMessage('Order status updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update order status.';
      setUpdateMessage(`Error: ${msg}`);
      console.error('Frontend (AdminOrders) - Status update error:', err.response ? err.response.data : err);
    }
  };

  if (loading && restaurants.length === 0 && !error) {
    return <div className="p-6 text-center"><p className="text-gray-600 text-lg">Loading admin data...</p></div>;
  }

  if (error) return <div className="p-6 text-center"><p className="text-red-600 font-semibold">{error}</p></div>;

  return (
    <div className="p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>

      {restaurants.length > 0 ? (
        <div className="mb-6">
          <label htmlFor="restaurant-select" className="block text-lg font-medium text-gray-700 mb-2">
            Select Restaurant:
          </label>
          <select
            id="restaurant-select"
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffaa00] text-gray-700"
          >
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">You don't have any restaurants to manage orders for. Please create one first.</p>
      )}

      {updateMessage && (
        <div className={`p-3 mb-4 rounded-md text-center ${updateMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {updateMessage}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center"><p className="text-gray-600 text-lg">Loading orders...</p></div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No orders found for this restaurant.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-lg shadow-md p-5 border border-gray-100">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-gray-800">Order #{order._id.substring(0, 8)}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-gray-700 mb-1"><strong>User ID:</strong> {order.userId}</p>
              <p className="text-gray-700 mb-1"><strong>Order Date:</strong> {format(new Date(order.orderDate), 'PPP p')}</p>
              <p className="text-gray-700 mb-3"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">Items:</h4>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name} (x{item.quantity}) - <span className="font-semibold">Rs. {item.price}</span>
                    {item.size && <span className="text-sm text-gray-500 ml-2">({item.size === 'full' ? 'Full Size' : 'Normal Size'})</span>} {/* Display size */}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center border-t pt-3 mt-4">
                <div className="text-xl font-bold text-gray-900">
                  Total: Rs. {order.totalAmount.toFixed(2)}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
