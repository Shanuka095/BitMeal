import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaHourglassHalf, FaPhone, FaCar, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { format } from 'date-fns';

// Fix for default marker icon missing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for markers
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


const ActiveOrderPage = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { showAlert } = useModal();
    const navigate = useNavigate();

    const fetchActiveOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            let decoded = null;
            if (token) {
                decoded = jwtDecode(token);
            }
            
            if (!token || decoded?.role !== 'customer') {
                setActiveOrder(null);
                setLoading(false);
                return;
            }
            
            const response = await axios.get('http://localhost:3000/api/orders/my-active-order-details', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActiveOrder(response.data || null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setActiveOrder(null);
            } else {
                const errorMessage = err.response?.data?.error || 'Failed to fetch active order.';
                setError(errorMessage);
                console.error('Frontend (ActiveOrderPage) - Fetch active order error:', err.response ? err.response.data : err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveOrder();
        const intervalId = setInterval(fetchActiveOrder, 5000); // Polling for updates
        return () => clearInterval(intervalId);
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
          case 'pending': return <FaHourglassHalf className="inline mr-2 text-yellow-500" />;
          case 'confirmed': return <FaCheckCircle className="inline mr-2 text-green-500" />;
          case 'preparing': return <FaCheckCircle className="inline mr-2 text-green-500" />;
          case 'out_for_delivery': return <FaMotorcycle className="inline mr-2 text-blue-500" />;
          case 'delivered': return <FaCheckCircle className="inline mr-2 text-green-500" />;
          case 'cancelled': return <FaTimesCircle className="inline mr-2 text-red-500" />;
          default: return null;
        }
    };

    if (loading) return <div className="p-6 text-center pt-32"><p className="text-gray-600">Loading your order details...</p></div>;
    if (error) return <div className="p-6 text-center pt-32"><p className="text-red-600 font-semibold">{error}</p></div>;
    if (!activeOrder) return <div className="p-6 text-center pt-32"><p className="text-gray-600">You don't have any active orders.</p></div>;

    const order = activeOrder;
    const driver = order.driver;
    const restaurant = order.restaurant;

    const driverLocation = driver?.currentLocation?.coordinates?.length === 2 ? [driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0]] : null;
    const restaurantLocation = restaurant?.location?.coordinates?.length === 2 ? [restaurant.location.coordinates[1], restaurant.location.coordinates[0]] : null;
    const deliveryLocation = order?.deliveryLocation?.coordinates?.length === 2 ? [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]] : null;

    const mapCenter = deliveryLocation || [6.9271, 79.8612];
    const positions = [
        ...(restaurantLocation ? [restaurantLocation] : []),
        ...(driverLocation ? [driverLocation] : []),
        ...(deliveryLocation ? [deliveryLocation] : []),
    ];

    const polylinePositions = driverLocation && deliveryLocation ? [driverLocation, deliveryLocation] : [];

    return (
        // FIX: Ensure main container pushes content down correctly
        <div className="p-6 pt-32 max-w-7xl mx-auto flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Left side: Order details */}
            <div className="md:w-1/3 bg-white rounded-xl shadow-lg p-6 flex-shrink-0">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Order #{order._id.substring(0, 8)}
                </h1>
                <p className="text-lg font-semibold text-gray-700 mb-4">
                    Status: <span className="capitalize">{getStatusIcon(order.status)} {order.status.replace(/_/g, ' ')}</span>
                </p>

                {restaurant && (
                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Restaurant</h2>
                        <p className="font-medium text-gray-700">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                    </div>
                )}
                
                {driver && (
                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Delivery Person</h2>
                        <div className="flex items-center space-x-2">
                            <FaMotorcycle className="text-blue-500" />
                            <p className="font-medium text-gray-700">{driver.name}</p>
                        </div>
                        <p className="text-sm text-gray-600">Vehicle: {driver.vehicleType} ({driver.licensePlate})</p>
                        <a href={`tel:${driver.phone}`} className="flex items-center text-sm text-blue-500 hover:underline">
                            <FaPhone className="mr-1" /> {driver.phone}
                        </a>
                    </div>
                )}

                <div className="border-t pt-4 mt-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-4">
                        {order.items.map((item, index) => (
                            <li key={index}>{item.name} (x{item.quantity}) - Rs. {item.price.toFixed(2)}</li>
                        ))}
                    </ul>
                    <p className="text-lg font-bold text-gray-900">Total: Rs. {order.totalAmount.toFixed(2)}</p>
                </div>
            </div>

            {/* Right side: Map */}
            <div className="md:w-2/3 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking Map</h2>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '500px', width: '100%', borderRadius: '8px' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {/* Restaurant Marker */}
                    {restaurantLocation && (
                        <Marker position={restaurantLocation} icon={restaurantIcon}>
                            <Popup>Restaurant: {restaurant.name}</Popup>
                        </Marker>
                    )}

                    {/* Driver Marker */}
                    {driverLocation && (
                        <Marker position={driverLocation} icon={driverIcon}>
                            <Popup>Your Driver: {driver.name}</Popup>
                        </Marker>
                    )}
                    
                    {/* Customer Delivery Location Marker */}
                    {deliveryLocation && (
                        <Marker position={deliveryLocation} icon={customerIcon}>
                            <Popup>Your Delivery Location</Popup>
                        </Marker>
                    )}

                    {/* Polyline showing driver's route */}
                    {positions.length > 1 && (
                        <Polyline positions={positions} color="#ffaa00" />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default ActiveOrderPage;
