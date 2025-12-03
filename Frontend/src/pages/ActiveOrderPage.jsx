import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaClock, FaPhone, FaMapMarkerAlt, FaUtensils, FaReceipt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLoader from '../components/PageLoader';
import { useTheme } from '../context/ThemeContext'; // Theme Hook

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const createIcon = (url) => new L.Icon({ iconUrl: url, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
const restaurantIcon = createIcon('https://cdn-icons-png.flaticon.com/512/3448/3448609.png');
const driverIcon = createIcon('https://cdn-icons-png.flaticon.com/512/1256/1256515.png');
const customerIcon = createIcon('https://cdn-icons-png.flaticon.com/512/2873/2873400.png');

const ActiveOrderPage = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [refreshing, setRefreshing] = useState(false);
    const mapRef = useRef(null); 
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const fetchActiveOrder = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        else setRefreshing(true);
        try {
            const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
            const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;
            if (!token) { setActiveOrder(null); return; }
            
            const response = await axios.get('http://localhost:3000/api/orders/my-active-order-details', { 
                headers: { Authorization: `Bearer ${token}` }, 
            });
            setActiveOrder(response.data || null);
        } catch (err) {
            if (err.response && err.response.status === 404) setActiveOrder(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchActiveOrder(false);
        const intervalId = setInterval(() => fetchActiveOrder(true), 6000);
        return () => clearInterval(intervalId);
    }, []);

    const StatusStep = ({ currentStatus, stepStatus, label, icon }) => {
        const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        const currentIndex = steps.indexOf(currentStatus);
        const stepIndex = steps.indexOf(stepStatus);
        const isCompleted = stepIndex <= currentIndex;
        const isActive = stepIndex === currentIndex;

        return (
            <div className={`relative z-10 flex flex-col items-center flex-1 transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-[#ffaa00] border-[#ffaa00] text-white scale-110 shadow-[0_0_20px_rgba(255,170,0,0.5)] animate-bounce' : isCompleted ? (isDark ? 'bg-white text-black border-white' : 'bg-gray-900 text-white border-gray-900') : (isDark ? 'bg-[#1a1a1a] border-white/10 text-gray-600' : 'bg-white border-gray-200 text-gray-300')}`}>
                    {icon}
                </div>
                <span className={`mt-3 text-[9px] md:text-xs font-bold uppercase tracking-wider text-center transition-colors ${isActive ? 'text-[#ffaa00]' : (isDark ? 'text-gray-500' : 'text-gray-500')}`}>
                    {label}
                </span>
            </div>
        );
    };

    if (loading) return <PageLoader />;
    
    // Theme Classes
    const pageBg = isDark ? 'bg-[#0f0f0f]' : 'bg-[#f8f9fa]';
    const cardBg = isDark ? 'bg-[#1a1a1a] border-white/5 shadow-black/50' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50';
    const textMain = isDark ? 'text-white' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

    if (!activeOrder) return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-500 ${pageBg}`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-[#ffaa00] text-5xl mb-8 shadow-inner animate-bounce ${isDark ? 'bg-white/5' : 'bg-orange-50'}`}>
                <FaReceipt />
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-3 text-center ${textMain}`}>No Active Order</h2>
            <p className={`mb-10 max-w-md text-center text-lg leading-relaxed ${textSub}`}>You don't have any orders currently in progress. Start a new food adventure today!</p>
            <button 
                onClick={() => navigate('/restaurants')} 
                className="px-10 py-4 bg-[#ffaa00] text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_-10px_rgba(255,170,0,0.4)] hover:bg-orange-600 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
                Browse Menu <FaArrowRight className="text-sm" />
            </button>
        </div>
    );

    const { driver, restaurant, deliveryLocation, status, items, totalAmount } = activeOrder;
    const driverLoc = driver?.currentLocation?.coordinates ? [driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0]] : null;
    const restaurantLoc = restaurant?.location?.coordinates ? [restaurant.location.coordinates[1], restaurant.location.coordinates[0]] : null;
    const userLoc = deliveryLocation?.coordinates ? [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]] : null;
    const mapCenter = driverLoc || userLoc || [6.9271, 79.8612];

    return (
        <div className={`min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${pageBg}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-full animate-fade-in-up">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Status Card */}
                    <div className={`rounded-[2.5rem] p-6 md:p-8 border relative overflow-hidden ${cardBg}`}>
                        {/* Progress Line */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <div className={`h-full bg-[#ffaa00] transition-all duration-1000 ${refreshing ? 'animate-pulse' : ''}`} style={{ width: '100%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-8 md:mb-10">
                            <div>
                                <h2 className={`text-xs font-extrabold uppercase tracking-[0.2em] mb-2 ${textSub}`}>Current Status</h2>
                                <h1 className={`text-2xl md:text-3xl font-black capitalize ${textMain}`}>{status.replace(/_/g, ' ')}</h1>
                            </div>
                            {status === 'out_for_delivery' && (
                                <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold animate-pulse flex items-center border border-green-500/20">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_10px_currentColor]"></span> Live
                                </div>
                            )}
                        </div>

                        {/* Status Stepper */}
                        <div className="flex justify-between relative mb-4 px-2">
                            <div className={`absolute top-5 left-0 w-full h-0.5 -z-0 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                            <StatusStep currentStatus={status} stepStatus="confirmed" label="Confirmed" icon={<FaCheckCircle size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="preparing" label="Cooking" icon={<FaUtensils size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="out_for_delivery" label="On Way" icon={<FaMotorcycle size={14}/>} />
                            <StatusStep currentStatus={status} stepStatus="delivered" label="Arrived" icon={<FaMapMarkerAlt size={12}/>} />
                        </div>
                    </div>

                    {/* Driver Card */}
                    {driver && (
                        <div className="bg-[#ffaa00] rounded-[2.5rem] p-6 text-black shadow-[0_20px_40px_-10px_rgba(255,170,0,0.3)] relative overflow-hidden group transition-transform hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                                    🛵
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Your Driver</p>
                                    <h3 className="text-2xl font-black tracking-tight">{driver.name}</h3>
                                    <p className="text-xs mt-1 flex items-center gap-2 font-bold opacity-80">
                                        <FaMotorcycle /> {driver.vehicleType} • {driver.licensePlate}
                                    </p>
                                </div>
                                <a href={`tel:${driver.phone}`} className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg transform hover:scale-110">
                                    <FaPhone />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Receipt Summary */}
                    <div className={`rounded-[2.5rem] border overflow-hidden ${cardBg}`}>
                        <div className={`p-6 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                            <h3 className={`text-xs font-extrabold uppercase tracking-widest flex items-center ${textMain}`}>
                                <FaReceipt className="mr-2 text-[#ffaa00]" /> Order Details
                            </h3>
                        </div>
                        <div className={`p-6 max-h-64 overflow-y-auto custom-scrollbar ${isDark ? 'bg-[#111]' : 'bg-[#fafafa]'}`}>
                            <ul className="space-y-4">
                                {items.map((item, i) => (
                                    <li key={i} className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            <span className="font-bold text-[#ffaa00] mr-3 text-sm">{item.quantity}x</span>
                                            <div>
                                                <p className={`text-sm font-bold ${textMain}`}>{item.name}</p>
                                                {item.size && <p className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mt-1 border ${isDark ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-white border-gray-200 text-gray-500'}`}>{item.size}</p>}
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Rs. {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={`p-6 border-t flex justify-between items-end ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-100'}`}>
                            <span className={`font-bold text-xs uppercase tracking-wider ${textSub}`}>Total Amount</span>
                            <span className={`text-2xl font-black ${textMain}`}>Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Map */}
                <div className={`lg:col-span-2 h-[500px] lg:h-auto rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 transition-all ${isDark ? 'bg-gray-900 border-[#222] shadow-black/60' : 'bg-white border-white shadow-gray-200/50'}`}>
                     <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                        <TileLayer 
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                            attribution='&copy; OpenStreetMap contributors'
                            className={isDark ? 'map-tiles-dark' : ''} // Optional: Add CSS filter for dark map tiles
                        />
                        {restaurantLoc && <Marker position={restaurantLoc} icon={restaurantIcon}><Popup>Restaurant</Popup></Marker>}
                        {userLoc && <Marker position={userLoc} icon={customerIcon}><Popup>You</Popup></Marker>}
                        {driverLoc && <Marker position={driverLoc} icon={driverIcon}><Popup>Driver</Popup></Marker>}
                        {driverLoc && userLoc && <Polyline positions={[driverLoc, userLoc]} color="#ffaa00" dashArray="10, 10" weight={4} />}
                     </MapContainer>
                     
                     {/* Floating Map Card */}
                     <div className={`absolute bottom-6 left-6 right-6 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border flex flex-col sm:flex-row items-center justify-between z-[400] gap-4 ${isDark ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-white/50'}`}>
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
                                <FaClock />
                            </div>
                            <div>
                                <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${textSub}`}>Estimated Arrival</p>
                                <p className={`text-2xl font-black ${textMain}`}>15 - 25 Mins</p>
                            </div>
                        </div>
                        {status === 'out_for_delivery' && (
                            <div className={`w-full sm:w-auto flex justify-center sm:justify-end items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest animate-pulse border ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_currentColor]"></div> GPS Live
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveOrderPage;