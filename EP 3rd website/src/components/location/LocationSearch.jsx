import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2, Compass } from 'lucide-react';
import { searchLocations } from '../../services/geocodingService';
import { KNOWN_LOCATIONS } from '../../data/mockLocations';

export default function LocationSearch({
  onSelectLocation,
  onUseCurrentLocation,
  isDetectingLocation = false,
  locationError = null,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const matches = await searchLocations(query);
        setResults(matches);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  const handlePick = (item) => {
    onSelectLocation(item);
    setQuery(item.name);
    setIsDropdownOpen(false);
  };

  // Curated quick-select locations
  const quickPicks = KNOWN_LOCATIONS.slice(0, 6);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      {/* Search Input Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #D9D7D0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease',
        }}
      >
        <Search style={{ width: '18px', height: '18px', color: '#77756F', flexShrink: 0 }} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsDropdownOpen(true);
          }}
          placeholder="Search city, area or address"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.96rem',
            color: '#242424',
            backgroundColor: 'transparent',
            fontWeight: '500',
          }}
        />

        {isSearching && (
          <Loader2
            style={{ width: '16px', height: '16px', color: '#B08D3C', animation: 'spin 1s linear infinite' }}
          />
        )}

        {query && !isSearching && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: '#8A8882',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isDropdownOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            zIndex: 600,
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {results.map((loc, idx) => (
            <div
              key={loc.id || idx}
              onClick={() => handlePick(loc)}
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                borderBottom: idx < results.length - 1 ? '1px solid #F1F0EB' : 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F6F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#F4EEDC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#B08D3C',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <MapPin style={{ width: '15px', height: '15px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#242424' }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#66645F', marginTop: '2px' }}>
                    {[loc.region, loc.country].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'monospace',
                  color: '#8A8882',
                  flexShrink: 0,
                }}
              >
                {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Use my current location" Action Bar (Section 6) */}
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onUseCurrentLocation}
          disabled={isDetectingLocation}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '11px 16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #D9D7D0',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isDetectingLocation) {
              e.currentTarget.style.backgroundColor = '#F4EEDC';
              e.currentTarget.style.borderColor = '#B08D3C';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDetectingLocation) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#D9D7D0';
            }
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F4EEDC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B08D3C',
              flexShrink: 0,
            }}
          >
            {isDetectingLocation ? (
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Navigation style={{ width: '16px', height: '16px' }} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#242424' }}>
              {isDetectingLocation ? 'Detecting your location...' : 'Use my current location'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#77756F' }}>
              {isDetectingLocation ? 'Fetching GPS coordinates from browser' : 'Detect your location automatically'}
            </div>
          </div>
        </button>

        {/* Permission / Geolocation Error Banner if any */}
        {locationError && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: '8px',
              fontSize: '0.76rem',
              color: '#C53030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{locationError}</span>
          </div>
        )}

        {/* Quick Location Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
          <span style={{ fontSize: '0.72rem', color: '#8A8882', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Popular:
          </span>
          {quickPicks.map((pick) => (
            <button
              key={pick.name}
              onClick={() => handlePick(pick)}
              style={{
                padding: '4px 10px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9D7D0',
                color: '#66645F',
                fontSize: '0.74rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F4EEDC';
                e.currentTarget.style.color = '#8E712C';
                e.currentTarget.style.borderColor = '#B08D3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#66645F';
                e.currentTarget.style.borderColor = '#D9D7D0';
              }}
            >
              {pick.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
