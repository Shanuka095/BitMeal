import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in some builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return null;
};

const MapComponent = ({ onLocationSelect, initialPosition = null }) => {
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        if (position) {
            onLocationSelect({
                type: 'Point',
                coordinates: [position.lng, position.lat] // GeoJSON format: [longitude, latitude]
            });
        }
    }, [position, onLocationSelect]);

    return (
        <MapContainer
            center={position || [6.9271, 79.8612]} // Default to Colombo, Sri Lanka
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && <Marker position={position} />}
            <LocationMarker setPosition={setPosition} />
        </MapContainer>
    );
};

export default MapComponent;
