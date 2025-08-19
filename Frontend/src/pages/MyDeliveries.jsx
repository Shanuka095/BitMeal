import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPhone, FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for markers (re-using from ActiveOrderPage)
const restaurantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png', // A restaurant icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1256/1256515.png', // A motorcycle icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const customerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2873/2873400.png', // A home icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});


const MyDeliveries = () => {
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showAlert, showConfirm } = useModal();

    const fetchAssignedOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) {
                showAlert('Authentication required. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:3000/api/orders/driver-assigned', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignedOrders(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch assigned orders.';
            setError(errorMessage);
            showAlert(`Error: ${errorMessage}`);
            console.error('Frontend (MyDeliveries) - Fetch assigned orders error:', err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedOrders();
        const intervalId = setInterval(fetchAssignedOrders, 10000); // Poll for updates
        return () => clearInterval(intervalId);
    }, []);

    const handleDriverAction = async (orderId, actionType) => {
        const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
        const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
        if (!token) {
            showAlert('Authentication required.');
            return;
        }

        let endpoint = '';
        let confirmMessage = '';
        switch (actionType) {
            case 'accept':
                endpoint = `/api/orders/${orderId}/driver-accept`;
                confirmMessage = 'Are you sure you want to accept this order?';
                break;
            case 'pickup':
                endpoint = `/api/orders/${orderId}/driver-pickup`;
                confirmMessage = 'Have you picked up the order from the restaurant?';
                break;
            case 'deliver':
                endpoint = `/api/orders/${orderId}/driver-deliver`;
                confirmMessage = 'Are you sure you want to mark this order as delivered?';
                break;
            default:
                showAlert('Invalid action.');
                return;
        }

        showConfirm(confirmMessage, async () => {
            try {
                await axios.patch(`http://localhost:3000${endpoint}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showAlert(`Order ${actionType}ed successfully!`);
                fetchAssignedOrders(); // Refresh list
            } catch (err) {
                const msg = err.response?.data?.error || `Failed to ${actionType} order.`;
                showAlert(`Error: ${msg}`);
                console.error(`Frontend (MyDeliveries) - ${actionType} order error:`, err.response ? err.response.data : err);
            }
        }, () => showAlert('Action cancelled.'));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'preparing': return 'bg-purple-100 text-purple-800';
            case 'out_for_delivery': return 'bg-green-100 text-green-800';
            case 'delivered': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    const newAssignments = assignedOrders.filter(order => order.status === 'pending' || order.status === 'confirmed');
    const activeDeliveries = assignedOrders.filter(order => order.status === 'preparing' || order.status === 'out_for_delivery');
    const completedDeliveries = assignedOrders.filter(order => order.status === 'delivered'); // Should not be fetched by this endpoint now, but kept for consistency if backend changes

    // Find the single active order for map display
    const currentActiveOrder = activeDeliveries.length > 0 ? activeDeliveries[0] : null;

    if (loading) return <div className="p-6 text-center"><p className="text-gray-600">Loading your deliveries...</p></div>;
    if (error) return <div className="p-6 text-center"><p className="text-red-600 font-semibold">{error}</p></div>;

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Deliveries</h1>

            {assignedOrders.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">No assigned orders at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* New Assignments */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">New Assignments ({newAssignments.length})</h2>
                        {newAssignments.length === 0 ? (
                            <p className="text-gray-600">No new orders waiting for acceptance.</p>
                        ) : (
                            <div className="space-y-4">
                                {newAssignments.map(order => (
                                    <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                                        <p className="font-semibold">Order #{order._id.substring(0, 8)}</p>
                                        <p className="text-sm text-gray-600">From: {order.restaurant?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">To: {order.deliveryAddress}</p>
                                        <p className={`text-sm font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${getStatusColor(order.status)}`}>
                                            Status: {order.status.replace(/_/g, ' ')}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            <button
                                                onClick={() => handleDriverAction(order._id, 'accept')}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                            >
                                                Accept
                                            </button>
                                            {/* <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">Reject</button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Deliveries */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Active Deliveries ({activeDeliveries.length})</h2>
                        {activeDeliveries.length === 0 ? (
                            <p className="text-gray-600">No active deliveries.</p>
                        ) : (
                            <div className="space-y-4">
                                {activeDeliveries.map(order => (
                                    <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                                        <p className="font-semibold">Order #{order._id.substring(0, 8)}</p>
                                        <p className="text-sm text-gray-600">From: {order.restaurant?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">To: {order.deliveryAddress}</p>
                                        <p className={`text-sm font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${getStatusColor(order.status)}`}>
                                            Status: {order.status.replace(/_/g, ' ')}
                                        </p>
                                        <div className="mt-3 flex space-x-2">
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleDriverAction(order._id, 'pickup')}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                                >
                                                    Picked Up
                                                </button>
                                            )}
                                            {order.status === 'out_for_delivery' && (
                                                <button
                                                    onClick={() => handleDriverAction(order._id, 'deliver')}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                                >
                                                    Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Map for current active delivery */}
            {currentActiveOrder && (
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Delivery Map (Order #{currentActiveOrder._id.substring(0, 8)})</h2>
                    <p className="text-gray-600 mb-4">Tracking route from {currentActiveOrder.restaurant?.name || 'Restaurant'} to {currentActiveOrder.deliveryAddress}.</p>
                    <MapContainer
                        center={currentActiveOrder.deliveryLocation ? [currentActiveOrder.deliveryLocation.coordinates[1], currentActiveOrder.deliveryLocation.coordinates[0]] : [6.9271, 79.8612]}
                        zoom={13}
                        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        {/* Restaurant Marker */}
                        {currentActiveOrder.restaurant?.location?.coordinates && (
                            <Marker position={[currentActiveOrder.restaurant.location.coordinates[1], currentActiveOrder.restaurant.location.coordinates[0]]} icon={restaurantIcon}>
                                <Popup>Restaurant: {currentActiveOrder.restaurant.name}</Popup>
                            </Marker>
                        )}

                        {/* Driver Marker (simulated location will update this) */}
                        {currentActiveOrder.driver?.currentLocation?.coordinates && (
                            <Marker position={[currentActiveOrder.driver.currentLocation.coordinates[1], currentActiveOrder.driver.currentLocation.coordinates[0]]} icon={driverIcon}>
                                <Popup>Your Current Location</Popup>
                            </Marker>
                        )}
                        
                        {/* Customer Delivery Location Marker */}
                        {currentActiveOrder.deliveryLocation?.coordinates && (
                            <Marker position={[currentActiveOrder.deliveryLocation.coordinates[1], currentActiveOrder.deliveryLocation.coordinates[0]]} icon={customerIcon}>
                                <Popup>Customer: {currentActiveOrder.customer?.name || 'N/A'}</Popup>
                            </Marker>
                        )}

                        {/* Polyline showing driver's route (Restaurant -> Driver -> Customer) */}
                        {currentActiveOrder.restaurant?.location?.coordinates && currentActiveOrder.driver?.currentLocation?.coordinates && currentActiveOrder.deliveryLocation?.coordinates && (
                            <Polyline
                                positions={[
                                    [currentActiveOrder.restaurant.location.coordinates[1], currentActiveOrder.restaurant.location.coordinates[0]],
                                    [currentActiveOrder.driver.currentLocation.coordinates[1], currentActiveOrder.driver.currentLocation.coordinates[0]],
                                    [currentActiveOrder.deliveryLocation.coordinates[1], currentActiveOrder.deliveryLocation.coordinates[0]]
                                ]}
                                color="#ffaa00" // Project's main color
                            />
                        )}
                    </MapContainer>
                </div>
            )}

            {/* Completed Deliveries (Optional: if backend fetches delivered orders for driver) */}
            {completedDeliveries.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Completed Deliveries ({completedDeliveries.length})</h2>
                    <div className="space-y-4">
                        {completedDeliveries.map(order => (
                            <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="font-semibold">Order #{order._id.substring(0, 8)}</p>
                                <p className="text-sm text-gray-600">Delivered to: {order.deliveryAddress}</p>
                                <p className={`text-sm font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${getStatusColor(order.status)}`}>
                                    Status: {order.status.replace(/_/g, ' ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDeliveries;
