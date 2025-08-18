import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SriLankaMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sri Lanka district coordinates (simplified - you can expand this)
const districtCoordinates = {
  'Colombo': [6.9271, 79.8612],
  'Gampaha': [7.0873, 80.0141],
  'Kalutara': [6.5854, 80.1285],
  'Kandy': [7.2906, 80.6337],
  'Matale': [7.4675, 80.6234],
  'Nuwara Eliya': [6.9497, 80.7891],
  'Galle': [6.0535, 80.2210],
  'Matara': [5.9549, 80.5550],
  'Hambantota': [6.1241, 81.1185],
  'Jaffna': [9.6615, 80.0255],
  'Kilinochchi': [9.3964, 80.4034],
  'Mannar': [8.9810, 79.9047],
  'Mullaitivu': [9.2670, 80.8142],
  'Vavuniya': [8.7514, 80.4971],
  'Puttalam': [8.0362, 79.8264],
  'Kurunegala': [7.4863, 80.3647],
  'Anuradhapura': [8.3114, 80.4037],
  'Polonnaruwa': [7.9403, 81.0188],
  'Badulla': [6.9934, 81.0550],
  'Monaragala': [6.8714, 81.3511],
  'Ratnapura': [6.6828, 80.3992],
  'Kegalle': [7.2513, 80.3464],
  'Ampara': [7.3011, 81.6747],
  'Batticaloa': [7.7102, 81.6924],
  'Trincomalee': [8.5874, 81.2152]
};

// Simple Sri Lanka boundary (you can use more detailed GeoJSON)
const sriLankaBounds = [
  [5.916, 79.652], // Southwest
  [9.835, 81.881]  // Northeast
];

const SriLankaMap = ({ selectedDistrict, onDistrictClick, coordinates }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (selectedDistrict && districtCoordinates[selectedDistrict] && mapRef.current) {
      const map = mapRef.current;
      const coords = districtCoordinates[selectedDistrict];
      map.setView(coords, 10);
    }
  }, [selectedDistrict]);

  const mapStyle = {
    height: '300px',
    width: '100%',
    borderRadius: '12px',
    minWidth: '350px'
  };

  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '1.1rem', 
        color: '#333',
        textAlign: 'center'
      }}>
        📍 Sri Lanka Map
      </h3>
      <MapContainer
        ref={mapRef}
        center={[7.8731, 80.7718]} // Center of Sri Lanka
        zoom={7}
        style={mapStyle}
        bounds={sriLankaBounds}
        className="sri-lanka-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Display all district markers */}
        {Object.entries(districtCoordinates).map(([district, coords]) => (
          <Marker
            key={district}
            position={coords}
            eventHandlers={{
              click: () => onDistrictClick && onDistrictClick(district)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{district}</strong>
                <br />
                <small>Click to select this district</small>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Highlight selected district */}
        {selectedDistrict && districtCoordinates[selectedDistrict] && (
          <Marker
            position={districtCoordinates[selectedDistrict]}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{selectedDistrict}</strong>
                <br />
                <em>Selected District</em>
                {coordinates && (
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    Lat: {coordinates.latitude.toFixed(3)}<br />
                    Lng: {coordinates.longitude.toFixed(3)}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default SriLankaMap;
