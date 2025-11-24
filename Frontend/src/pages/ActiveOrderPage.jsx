import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaClock, FaPhone, FaMapMarkerAlt, FaUtensils, FaReceipt, FaChevronRight } from 'react-icons/fa';
import { useModal } from '../context/ModalContext';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLoader from '../components/PageLoader';

// Fix for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Map Icons
const createIcon = (url) => new L.Icon({ iconUrl: url, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
const restaurantIcon = createIcon('https://cdn-icons-png.flaticon.com/512/3448/3448609.png');
const driverIcon = createIcon('https://cdn-icons-png.flaticon.com/512/1256/1256515.png');
const customerIcon = createIcon('https://cdn-icons-png.flaticon.com/512/2873/2873400.png');

const ActiveOrderPage = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true); // Controls initial page loader
    const [refreshing, setRefreshing] = useState(false); // Controls silent background updates
    const [error, setError] = useState('');
    const mapRef = useRef(null); // Ref to keep map stable
    const navigate = useNavigate();

    const fetchActiveOrder = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        else setRefreshing(true);
        
        setError('');
        
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            
            if (!token) {
                setActiveOrder(null);
                return;
            }
            
            const response = await axios.get('http://localhost:3000/api/orders/my-active-order-details', {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Only update state if data changed (optional optimization, but React handles diffing well)
            setActiveOrder(response.data || null);

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setActiveOrder(null);
            } else {
                console.error("Order fetch error", err);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchActiveOrder(false);
        
        // Polling every 6 seconds for updates
        const intervalId = setInterval(() => {
            fetchActiveOrder(true); // Pass true to indicate background refresh
        }, 6000);

        return () => clearInterval(intervalId);
    }, []);

    // --- Components ---
    const StatusStep = ({ currentStatus, stepStatus, label, icon }) => {
        const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        const currentIndex = steps.indexOf(currentStatus);
        const stepIndex = steps.indexOf(stepStatus);
        const isCompleted = stepIndex <= currentIndex;
        const isActive = stepIndex === currentIndex;

        return (
            <div className={`relative z-10 flex flex-col items-center flex-1 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive 
                    ? 'bg-[#ffaa00] border-[#ffaa00] text-white scale-110 shadow-lg shadow-orange-500/30' 
                    : isCompleted ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-300'
                }`}>
                    {icon}
                </div>
                <span className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center ${isActive ? 'text-[#ffaa00]' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>
        );
    };

    if (loading) return <PageLoader />;

    if (!activeOrder) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] text-center px-4">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center text-gray-400 text-4xl mb-6">
                <FaReceipt />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No Active Order</h2>
            <p className="text-gray-500 mb-8">Start a new food adventure today.</p>
            <button onClick={() => navigate('/restaurants')} className="bg-[#ffaa00] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#e59400] transition">Browse Menu</button>
        </div>
    );

    const { driver, restaurant, deliveryLocation, status, items, totalAmount, _id } = activeOrder;

    // Map Coordinates
    const driverLoc = driver?.currentLocation?.coordinates ? [driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0]] : null;
    const restaurantLoc = restaurant?.location?.coordinates ? [restaurant.location.coordinates[1], restaurant.location.coordinates[0]] : null;
    const userLoc = deliveryLocation?.coordinates ? [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]] : null;
    
    const mapCenter = driverLoc || userLoc || [6.9271, 79.8612];

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                
                {/* LEFT COLUMN: Order Details & Status */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* 1. Status Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                            <div className={`h-full bg-[#ffaa00] transition-all duration-1000 ${refreshing ? 'animate-pulse' : ''}`} style={{ width: '100%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Order Status</h2>
                                <h1 className="text-2xl font-black text-gray-900 capitalize">{status.replace(/_/g, ' ')}</h1>
                            </div>
                            {status === 'out_for_delivery' && (
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Live
                                </div>
                            )}
                        </div>

                        {/* Stepper */}
                        <div className="flex justify-between relative mb-6">
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
                            <StatusStep currentStatus={status} stepStatus="confirmed" label="Confirmed" icon={<FaCheckCircle size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="preparing" label="Cooking" icon={<FaUtensils size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="out_for_delivery" label="On Way" icon={<FaMotorcycle size={14}/>} />
                            <StatusStep currentStatus={status} stepStatus="delivered" label="Arrived" icon={<FaMapMarkerAlt size={12}/>} />
                        </div>
                    </div>

                    {/* 2. Driver Card (If Assigned) */}
                    {driver && (
                        <div className="bg-gray-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl">
                                    👮‍♂️
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Your Driver</p>
                                    <h3 className="text-xl font-bold">{driver.name}</h3>
                                    <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
                                        <FaMotorcycle className="text-[#ffaa00]" /> {driver.vehicleType} • {driver.licensePlate}
                                    </p>
                                </div>
                                <a href={`tel:${driver.phone}`} className="w-12 h-12 rounded-full bg-[#ffaa00] flex items-center justify-center text-black hover:bg-white transition-colors shadow-lg">
                                    <FaPhone />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* 3. Order Summary */}
                    <div className="bg-white rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide flex items-center">
                                <FaReceipt className="mr-2 text-[#ffaa00]" /> Order Summary
                            </h3>
                        </div>
                        <div className="p-6 bg-gray-50/50 max-h-60 overflow-y-auto custom-scrollbar">
                            <ul className="space-y-4">
                                {items.map((item, i) => (
                                    <li key={i} className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            <span className="font-bold text-[#ffaa00] mr-3 text-sm">{item.quantity}x</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.size}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Rs. {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Total Amount</span>
                            <span className="text-2xl font-black text-gray-900">Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Live Map */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto bg-gray-200 rounded-[2.5rem] overflow-hidden shadow-inner relative border-4 border-white">
                     <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        {restaurantLoc && (
                            <Marker position={restaurantLoc} icon={restaurantIcon}>
                                <Popup className="font-bold">Restaurant: {restaurant.name}</Popup>
                            </Marker>
                        )}
                        
                        {userLoc && (
                            <Marker position={userLoc} icon={customerIcon}>
                                <Popup className="font-bold">Your Location</Popup>
                            </Marker>
                        )}

                        {driverLoc && (
                            <Marker position={driverLoc} icon={driverIcon}>
                                <Popup className="font-bold">Driver: {driver.name}</Popup>
                            </Marker>
                        )}

                        {driverLoc && userLoc && <Polyline positions={[driverLoc, userLoc]} color="#ffaa00" dashArray="10, 10" />}
                     </MapContainer>
                     
                     {/* Floating ETA Overlay */}
                     <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center justify-between z-[400]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl">
                                <FaClock />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Estimated Arrival</p>
                                <p className="text-lg font-black text-gray-900">15 - 25 Mins</p>
                            </div>
                        </div>
                        {status === 'out_for_delivery' && (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wide animate-pulse">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Tracking Live
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveOrderPage;