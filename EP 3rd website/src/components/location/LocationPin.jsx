import React from 'react';

/**
 * Modern, crisp location pin fixed in the exact center of the map viewport.
 * Elevates slightly during panning (Blinkit/Zepto/Google Maps UX pattern),
 * and settles firmly on the ground when movement ceases.
 */
export default function LocationPin({ isDragging = false, label = '' }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 500,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* Floating Pin Body */}
      <div
        style={{
          transform: isDragging ? 'translateY(-14px) scale(1.06)' : 'translateY(-2px) scale(1)',
          transition: 'transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))',
        }}
      >
        {/* Optional floating micro-badge on drag or hover */}
        {label && (
          <div
            style={{
              marginBottom: '6px',
              backgroundColor: '#FFFFFF',
              color: '#242424',
              fontSize: '0.74rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid #D9D7D0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#B08D3C',
                display: 'inline-block',
              }}
            />
            <span>{label}</span>
          </div>
        )}

        {/* Custom SVG Pin with EcoPredict Gold Head & Reticle Dot */}
        <svg
          width="42"
          height="52"
          viewBox="0 0 42 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pin Silhouette */}
          <path
            d="M21 0C9.402 0 0 9.402 0 21C0 32.55 18.25 50.15 20.08 51.78C20.61 52.25 21.39 52.25 21.92 51.78C23.75 50.15 42 32.55 42 21C42 9.402 32.598 0 21 0Z"
            fill="#B08D3C"
          />
          {/* Inner Highlight Ring */}
          <circle cx="21" cy="20" r="14" fill="#FFFFFF" />
          {/* Center Target Dot */}
          <circle cx="21" cy="20" r="7" fill="#8E712C" />
          <circle cx="21" cy="20" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Ground Contact Shadow & Pulsing Crosshair */}
      <div
        style={{
          position: 'relative',
          width: '28px',
          height: '10px',
          marginTop: '-6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ground elliptical shadow that shrinks when the pin jumps up */}
        <div
          style={{
            width: isDragging ? '14px' : '22px',
            height: isDragging ? '4px' : '7px',
            borderRadius: '50%',
            backgroundColor: 'rgba(36, 36, 36, 0.28)',
            filter: 'blur(2px)',
            transition: 'all 0.22s ease-out',
          }}
        />
        {/* Tiny pinpoint reticle dot */}
        <div
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: '#8E712C',
            top: '3px',
          }}
        />
      </div>
    </div>
  );
}
