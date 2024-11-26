import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './MapComponentuser.css'
interface MapProps {
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
  return (
    <MapContainer center={[latitude, longitude]} zoom={10} style={{ height: '400px', width: '75%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]} icon={new L.Icon.Default()}>
        <Popup>Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
