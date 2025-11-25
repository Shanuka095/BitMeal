import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMotorcycle, FaCheckCircle, FaClock, FaPhone, FaMapMarkerAlt, FaUtensils, FaReceipt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PageLoader from '../components/PageLoader';

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

    const fetchActiveOrder = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        else setRefreshing(true);
        
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
            
            setActiveOrder(response.data || null);

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setActiveOrder(null);
            }
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
            <div className={`relative z-10 flex flex-col items-center flex-1 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive 
                    ? 'bg-[#ffaa00] border-[#ffaa00] text-white scale-110 shadow-lg shadow-orange-500/30 animate-bounce' 
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
            <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center text-[#ffaa00] text-5xl mb-6 shadow-lg">
                <FaReceipt />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">No Active Order</h2>
            <p className="text-gray-500 mb-8 max-w-md">You don't have any orders currently in progress. Start a new food adventure today!</p>
            <button onClick={() => navigate('/restaurants')} className="bg-[#ffaa00] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-[#e59400] transition transform hover:-translate-y-1">Browse Menu</button>
        </div>
    );

    const { driver, restaurant, deliveryLocation, status, items, totalAmount } = activeOrder;

    const driverLoc = driver?.currentLocation?.coordinates ? [driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0]] : null;
    const restaurantLoc = restaurant?.location?.coordinates ? [restaurant.location.coordinates[1], restaurant.location.coordinates[0]] : null;
    const userLoc = deliveryLocation?.coordinates ? [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]] : null;
    
    const mapCenter = driverLoc || userLoc || [6.9271, 79.8612];

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-fade-in-up">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Status Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                            <div className={`h-full bg-[#ffaa00] transition-all duration-1000 ${refreshing ? 'animate-pulse' : ''}`} style={{ width: '100%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</h2>
                                <h1 className="text-2xl font-black text-gray-900 capitalize">{status.replace(/_/g, ' ')}</h1>
                            </div>
                            {status === 'out_for_delivery' && (
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Live
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between relative mb-6">
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
                            <StatusStep currentStatus={status} stepStatus="confirmed" label="Confirmed" icon={<FaCheckCircle size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="preparing" label="Cooking" icon={<FaUtensils size={12}/>} />
                            <StatusStep currentStatus={status} stepStatus="out_for_delivery" label="On Way" icon={<FaMotorcycle size={14}/>} />
                            <StatusStep currentStatus={status} stepStatus="delivered" label="Arrived" icon={<FaMapMarkerAlt size={12}/>} />
                        </div>
                    </div>

                    {/* Driver Card */}
                    {driver && (
                        <div className="bg-[#1a1a1a] rounded-[2.5rem] p-6 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group transition-transform hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/10">
                                    🛵
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Your Driver</p>
                                    <h3 className="text-lg font-bold">{driver.name}</h3>
                                    <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
                                        <FaMotorcycle className="text-[#ffaa00]" /> {driver.vehicleType} • {driver.licensePlate}
                                    </p>
                                </div>
                                <a href={`tel:${driver.phone}`} className="w-12 h-12 rounded-full bg-[#ffaa00] flex items-center justify-center text-black hover:bg-white transition-colors shadow-lg">
                                    <FaPhone />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="bg-white rounded-[2.5rem] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide flex items-center">
                                <FaReceipt className="mr-2 text-[#ffaa00]" /> Receipt
                            </h3>
                        </div>
                        <div className="p-6 bg-[#fafafa] max-h-60 overflow-y-auto custom-scrollbar">
                            <ul className="space-y-4">
                                {items.map((item, i) => (
                                    <li key={i} className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            <span className="font-bold text-[#ffaa00] mr-3 text-sm">{item.quantity}x</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                {item.size && <p className="text-[10px] text-gray-500 font-bold uppercase bg-white px-2 py-0.5 rounded inline-block mt-1 border border-gray-100">{item.size}</p>}
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Rs. {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500 font-medium text-sm">Total Paid</span>
                            <span className="text-xl font-black text-gray-900">Rs. {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Map */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 relative border-4 border-white">
                     <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {restaurantLoc && <Marker position={restaurantLoc} icon={restaurantIcon}><Popup>Restaurant</Popup></Marker>}
                        {userLoc && <Marker position={userLoc} icon={customerIcon}><Popup>You</Popup></Marker>}
                        {driverLoc && <Marker position={driverLoc} icon={driverIcon}><Popup>Driver</Popup></Marker>}
                        {driverLoc && userLoc && <Polyline positions={[driverLoc, userLoc]} color="#ffaa00" dashArray="10, 10" />}
                     </MapContainer>
                     
                     <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 flex flex-col sm:flex-row items-center justify-between z-[400] gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl">
                                <FaClock />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Arrival</p>
                                <p className="text-xl font-black text-gray-900">15 - 25 Mins</p>
                            </div>
                        </div>
                        {status === 'out_for_delivery' && (
                            <div className="w-full sm:w-auto flex justify-center sm:justify-end items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold uppercase tracking-wide animate-pulse border border-blue-100">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> GPS Live
                            </div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

export default ActiveOrderPage;