import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import  {  LatLngTuple } from 'leaflet';
import { Slot } from '../ServiceProviderForm/ViewSlot/viewslot';



interface MapProps {
  slots: Slot[];
}

const MapEventsHandler: React.FC<{ setSelectedPosition: (pos: LatLngTuple | null) => void }> = ({ setSelectedPosition }) => {
  useMapEvents({
    click(e) {
      const newPosition: LatLngTuple = [e.latlng.lat, e.latlng.lng];
      setSelectedPosition(newPosition);
    },
  });

  return null; // This component doesn't render anything
};

const MapComponent: React.FC<MapProps> = ({ slots }) => {
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(null);

  // Convert coordinates to LatLngTuple format
  const positions: LatLngTuple[] = slots.map((slot: Slot) => [slot.latitude, slot.longitude] as LatLngTuple);

  return (
    <MapContainer center={positions.length > 0 ? positions[0] : [12.92657, 77.5835]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEventsHandler setSelectedPosition={setSelectedPosition} />
      {positions.map((position, index) => (
        <Marker key={index} position={position}>
          <Popup>
            Latitude: {position[0]} <br /> Longitude: {position[1]}
          </Popup>
        </Marker>
      ))}
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>
            Selected Location: {selectedPosition[0]}, {selectedPosition[1]}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
