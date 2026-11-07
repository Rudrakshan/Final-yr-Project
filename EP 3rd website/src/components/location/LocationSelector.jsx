import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import LocationMap from './LocationMap';
import LocationPin from './LocationPin';
import LocationSearch from './LocationSearch';
import LocationConfirmationPanel from './LocationConfirmationPanel';
import { reverseGeocode, getCurrentDeviceLocation } from '../../services/geocodingService';
import { useLocation } from '../../context/LocationContext';
import { KNOWN_LOCATIONS } from '../../data/mockLocations';

export default function LocationSelector({ onConfirm, onCancel, serviceName }) {
  const { selectedLocation, closeLocationSelector } = useLocation();

  // Coordinates of the map center (and fixed pin)
  const initialLat = selectedLocation ? selectedLocation.latitude : 11.0168;
  const initialLng = selectedLocation ? selectedLocation.longitude : 76.9558;

  const [centerCoords, setCenterCoords] = useState({ lat: initialLat, lng: initialLng });
  const [activeLocation, setActiveLocation] = useState(selectedLocation || KNOWN_LOCATIONS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const resolveTimerRef = useRef(null);

  // Debounced reverse geocode on map pan end
  const triggerReverseGeocode = useCallback((coords) => {
    if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    setIsResolving(true);

    resolveTimerRef.current = setTimeout(async () => {
      try {
        const resolved = await reverseGeocode(coords.lat, coords.lng);
        setActiveLocation(resolved);
      } catch (err) {
        console.error('Reverse geocode error:', err);
      } finally {
        setIsResolving(false);
      }
    }, 320);
  }, []);

  const handleCenterChange = (coords) => {
    setCenterCoords(coords);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setLocationError(null);
  };

  const handleDragEnd = (coords) => {
    setIsDragging(false);
    setCenterCoords(coords);
    triggerReverseGeocode(coords);
  };

  // When a location is selected via Search autocomplete or popular pill
  const handleSelectFromSearch = (loc) => {
    const coords = { lat: loc.latitude, lng: loc.longitude };
    setCenterCoords(coords);
    setActiveLocation(loc);
    setLocationError(null);
  };

  // When "Use my current location" is tapped
  const handleUseCurrentLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      const pos = await getCurrentDeviceLocation();
      const coords = { lat: pos.latitude, lng: pos.longitude };
      setCenterCoords(coords);
      triggerReverseGeocode(coords);
    } catch (err) {
      setLocationError(err.message || 'Could not retrieve current location.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Confirm Selection
  const handleConfirm = () => {
    const confirmed = {
      ...activeLocation,
      latitude: centerCoords.lat,
      longitude: centerCoords.lng,
      name: activeLocation.name || 'Selected Location',
      region: activeLocation.region || '',
      country: activeLocation.country || ''
    };

    if (onConfirm) {
      onConfirm(confirmed);
    } else {
      closeLocationSelector(confirmed);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeLocationSelector();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#F7F6F2',
        color: '#242424',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP HEADER & SEARCH OVERLAY */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 480,
          pointerEvents: 'none',
          padding: '20px 24px',
          background: 'linear-gradient(180deg, rgba(247, 246, 242, 0.95) 0%, rgba(247, 246, 242, 0.8) 75%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            pointerEvents: 'auto',
          }}
        >
          {/* Back Button */}
          <button
            onClick={handleCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              color: '#242424',
              fontSize: '0.86rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F4EEDC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back</span>
          </button>

          {/* Title Header */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#242424',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Choose your location
            </h2>
            <p
              style={{
                fontSize: '0.76rem',
                color: '#66645F',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Select a location to begin your environmental analysis.
            </p>
          </div>

          <div style={{ width: '70px', flexShrink: 0 }} />
        </div>

        {/* Search & Location Trigger Container */}
        <div style={{ width: '100%', maxWidth: '560px', pointerEvents: 'auto' }}>
          <LocationSearch
            onSelectLocation={handleSelectFromSearch}
            onUseCurrentLocation={handleUseCurrentLocation}
            isDetectingLocation={isDetectingLocation}
            locationError={locationError}
          />
        </div>
      </div>

      {/* FULLSCREEN INTERACTIVE MAP */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <LocationMap
          center={centerCoords}
          zoom={12}
          onCenterChange={handleCenterChange}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />

        {/* Fixed Center Selection Pin — floats free, no label */}
        <LocationPin isDragging={isDragging} />
      </div>

      {/* BOTTOM CONFIRMATION PANEL / MOBILE BOTTOM SHEET */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 480,
          pointerEvents: 'auto',
          width: '92%',
          maxWidth: '400px',
        }}
      >
        <LocationConfirmationPanel
          location={activeLocation}
          coordinates={centerCoords}
          isResolving={isResolving}
          onConfirm={handleConfirm}
          serviceName={serviceName}
        />
      </div>
    </div>
  );
}
