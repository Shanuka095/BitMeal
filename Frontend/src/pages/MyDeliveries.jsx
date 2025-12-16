import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaMapMarkerAlt, FaBoxOpen, FaUser, FaPhone } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { useTheme } from '../context/ThemeContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icons config
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MyDeliveries = () => {
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showAlert, showConfirm } = useModal();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchAssignedOrders = async () => {
        setLoading(true);
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) return;

            const response = await axios.get('http://localhost:3000/api/orders/driver-assigned', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignedOrders(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedOrders();
        const interval = setInterval(fetchAssignedOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (orderId, actionType, confirmMsg) => {
        showConfirm(confirmMsg, async () => {
            try {
                const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
                const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
                
                await axios.patch(`http://localhost:3000/api/orders/${orderId}/driver-${actionType}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showAlert('Success!');
                fetchAssignedOrders();
            } catch (err) {
                showAlert('Action failed.');
            }
        }, () => {});
    };

    // Theme Classes
    const textMain = isDark ? 'text-white' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
    const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100';

    const newAssignments = assignedOrders.filter(o => o.status === 'confirmed'); // Pending acceptance
    const activeDeliveries = assignedOrders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery');

    if (loading && assignedOrders.length === 0) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="w-full">
            <h1 className={`text-3xl font-black mb-8 ${textMain}`}>My Deliveries</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* COLUMN 1: NEW REQUESTS */}
                <div>
                    <h2 className={`text-lg font-bold uppercase tracking-widest mb-4 ${textSub}`}>New Requests</h2>
                    {newAssignments.length === 0 ? (
                        <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-white/10 text-gray-600' : 'border-gray-200 text-gray-400'}`}>No new requests</div>
                    ) : (
                        <div className="space-y-4">
                            {newAssignments.map(order => (
                                <div key={order._id} className={`p-6 rounded-2xl border shadow-lg ${cardBg}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">New Order</span>
                                            <h3 className={`text-lg font-bold mt-2 ${textMain}`}>{order.restaurant?.name}</h3>
                                            <p className={`text-xs ${textSub}`}>{order.deliveryAddress}</p>
                                        </div>
                                        <div className={`text-xl font-black ${textMain}`}>Rs. {order.totalAmount.toFixed(0)}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleAction(order._id, 'accept', 'Accept this order?')}
                                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                                    >
                                        Accept Order
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* COLUMN 2: ACTIVE DELIVERIES */}
                <div>
                    <h2 className={`text-lg font-bold uppercase tracking-widest mb-4 ${textSub}`}>Active Deliveries</h2>
                    {activeDeliveries.length === 0 ? (
                        <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-white/10 text-gray-600' : 'border-gray-200 text-gray-400'}`}>No active deliveries</div>
                    ) : (
                        <div className="space-y-6">
                            {activeDeliveries.map(order => (
                                <div key={order._id} className={`p-6 rounded-[2rem] border shadow-xl relative overflow-hidden ${cardBg}`}>
                                    {/* Progress Bar */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-white/10">
                                        <div className={`h-full bg-blue-500 transition-all duration-1000 ${order.status === 'out_for_delivery' ? 'w-3/4' : 'w-1/4'}`}></div>
                                    </div>

                                    <div className="mt-4 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${order.status === 'out_for_delivery' ? 'text-green-500' : 'text-orange-500'}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                            <span className={`text-sm font-black ${textMain}`}>#{order._id.substring(0,6)}</span>
                                        </div>
                                        <h3 className={`text-xl font-black ${textMain}`}>{order.restaurant?.name}</h3>
                                        <p className={`text-sm ${textSub} mb-4`}>{order.deliveryAddress}</p>
                                        
                                        {/* Actions */}
                                        {order.status === 'preparing' && (
                                            <button 
                                                onClick={() => handleAction(order._id, 'pickup', 'Confirm pickup from restaurant?')}
                                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                                            >
                                                <FaBoxOpen /> Confirm Pickup
                                            </button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                            <button 
                                                onClick={() => handleAction(order._id, 'deliver', 'Confirm delivery complete?')}
                                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
                                            >
                                                <FaCheckCircle /> Mark Delivered
                                            </button>
                                        )}
                                    </div>

                                    {/* Map Preview */}
                                    <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 relative z-0">
                                        <MapContainer 
                                            center={[6.9271, 79.8612]} 
                                            zoom={13} 
                                            style={{ height: '100%', width: '100%' }}
                                            scrollWheelZoom={false}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            {/* Add simple markers here based on coordinates if available */}
                                        </MapContainer>
                                        {/* Overlay to prevent interaction if needed */}
                                        <div className="absolute inset-0 bg-transparent"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyDeliveries;