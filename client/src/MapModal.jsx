import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background: #f5f5f5;
  }
`;

const MapTitle = styled.h2`
  margin-bottom: 15px;
  font-size: 1.5rem;
`;

const MapWrapper = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 20px;
  text-align: center;
  background: #fdecea;
  border-radius: 8px;
  margin-top: 20px;
`;

const MapModal = ({ isOpen, onClose, propertyName, city, state }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!city) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Add small delay to respect Nominatim's usage policy
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Combine city and state for better accuracy
        const searchQuery = `${city}${state ? `, ${state}` : ''}, Nigeria`;
        const encodedQuery = encodeURIComponent(searchQuery);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error('Location not found');
        }
        
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } catch (err) {
        setError(err.message);
        // Default to Nigeria's center if geocoding fails
        setCoordinates([9.0820, 8.6753]);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCoordinates();
    }
  }, [isOpen, city, state]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <MapTitle>{propertyName} - {city}</MapTitle>
        <MapWrapper>
          {coordinates && (
            <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={coordinates}>
                <Popup>
                  {propertyName}<br />
                  {city}{state ? `, ${state}` : ''}
                </Popup>
              </Marker>
            </MapContainer>
          )}
          {loading && (
            <LoadingOverlay>
              <div className="loading-spinner">Loading map...</div>
            </LoadingOverlay>
          )}
        </MapWrapper>
        {error && (
          <ErrorMessage>
            {error === 'Location not found' 
              ? 'Unable to find exact location. Showing approximate area.' 
              : 'Error loading map location. Showing default view.'}
          </ErrorMessage>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default MapModal;