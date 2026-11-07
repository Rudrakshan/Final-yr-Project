import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Plus, Minus, Compass } from 'lucide-react';

/**
 * Lightweight, high-performance interactive vector map using MapLibre GL JS + OpenFreeMap Liberty style.
 * Supports smooth pan, touch pinch, zoom controls, and center tracking.
 */
export default function LocationMap({
  center = { lat: 11.0168, lng: 76.9558 },
  zoom = 12,
  onCenterChange,
  onDragStart,
  onDragEnd,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const isProgrammaticMoveRef = useRef(false);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create MapLibre map with OpenFreeMap Liberty style
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false,
    });

    // Keep OpenFreeMap / OpenStreetMap attribution visible
    map.addControl(
      new maplibregl.AttributionControl({
        compact: false,
      }),
      'bottom-right'
    );

    // Track user drag/move events
    map.on('dragstart', () => {
      if (onDragStart) {
        onDragStart();
      }
    });

    map.on('movestart', (e) => {
      if (!isProgrammaticMoveRef.current && e.originalEvent && onDragStart) {
        onDragStart();
      }
    });

    map.on('move', () => {
      if (!isProgrammaticMoveRef.current && onCenterChange) {
        const c = map.getCenter();
        onCenterChange({
          lat: Number(c.lat.toFixed(4)),
          lng: Number(c.lng.toFixed(4)),
        });
      }
    });

    map.on('moveend', () => {
      const c = map.getCenter();
      const coords = {
        lat: Number(c.lat.toFixed(4)),
        lng: Number(c.lng.toFixed(4)),
      };

      if (!isProgrammaticMoveRef.current && onDragEnd) {
        onDragEnd(coords);
      }
      isProgrammaticMoveRef.current = false;
    });

    mapInstanceRef.current = map;

    // Resize map when container changes or mounts
    const timer = setTimeout(() => {
      map.resize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Pan smoothly to updated center coordinates when changed from search or current location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    const latDiff = Math.abs(currentCenter.lat - center.lat);
    const lngDiff = Math.abs(currentCenter.lng - center.lng);

    // Only pan if delta is substantial to avoid echo loops from dragging
    if (latDiff > 0.0005 || lngDiff > 0.0005) {
      isProgrammaticMoveRef.current = true;
      map.flyTo({
        center: [center.lng, center.lat],
        zoom: Math.max(map.getZoom(), 12),
        duration: 1200,
        essential: true,
      });
    }
  }, [center.lat, center.lng]);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = (e) => {
    e.stopPropagation();
    if (mapInstanceRef.current) {
      isProgrammaticMoveRef.current = true;
      mapInstanceRef.current.flyTo({
        center: [center.lng, center.lat],
        zoom: 12,
        duration: 800,
        essential: true,
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Map DOM target */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#F1F0EB',
        }}
      />

      {/* Floating Map Zoom & Recenter Controls (Right-middle) */}
      <div
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 450,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            color: '#B08D3C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F4EEDC';
            e.currentTarget.style.borderColor = '#B08D3C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#D9D7D0';
          }}
        >
          <Compass style={{ width: '20px', height: '20px' }} />
        </button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              width: '40px',
              height: '40px',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #E5E3DD',
              color: '#242424',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F6F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              width: '40px',
              height: '40px',
              background: 'none',
              border: 'none',
              color: '#242424',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F6F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Minus style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
