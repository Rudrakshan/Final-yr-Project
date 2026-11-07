import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_LOCATION } from '../data/mockLocations';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('ecopredict_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [activeService, setActiveService] = useState(null); // 'energy' | 'site' | 'risk' | 'scenario'
  const [isLocationSelectorActive, setIsLocationSelectorActive] = useState(false);
  const [pendingServiceTarget, setPendingServiceTarget] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('ecopredict_location', JSON.stringify(selectedLocation));
    } catch (err) {
      console.warn('Could not cache location to localStorage:', err);
    }
  }, [selectedLocation]);

  const setLocation = (loc) => {
    setSelectedLocation(loc);
  };

  const openLocationSelector = (serviceTarget = null) => {
    setPendingServiceTarget(serviceTarget);
    setIsLocationSelectorActive(true);
  };

  const closeLocationSelector = (confirmedLocation = null) => {
    if (confirmedLocation) {
      setSelectedLocation(confirmedLocation);
    }
    setIsLocationSelectorActive(false);
    return pendingServiceTarget;
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: setLocation,
        activeService,
        setActiveService,
        isLocationSelectorActive,
        openLocationSelector,
        closeLocationSelector,
        pendingServiceTarget,
        setPendingServiceTarget
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return ctx;
}
