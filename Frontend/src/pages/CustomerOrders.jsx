import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch your orders.');
        console.error('Frontend (CustomerOrders) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center pt-24"><p className="text-gray-600">Loading your orders...</p></div>;
  if (error) return <div className="p-6 text-center pt-24"><p className="text-red-600 font-semibold">{error}</p></div>;

  return (
    <div className="p-6 pt-24 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">Order #{order._id.substring(0, 8)}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-gray-700 mb-2"><strong>Restaurant ID:</strong> {order.restaurantId}</p>
              <p className="text-gray-700 mb-2"><strong>Order Date:</strong> {format(new Date(order.orderDate), 'PPP p')}</p>
              <p className="text-gray-700 mb-4"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Items:</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name} (x{item.quantity}) - <span className="font-semibold">Rs. {item.price}</span>
                    {item.size && <span className="text-sm text-gray-500 ml-2">({item.size === 'full' ? 'Full Size' : 'Normal Size'})</span>} {/* Display size */}
                  </li>
                ))}
              </ul>
              <div className="text-right text-2xl font-bold text-gray-900 border-t pt-3 mt-4">
                Total: Rs. {order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
