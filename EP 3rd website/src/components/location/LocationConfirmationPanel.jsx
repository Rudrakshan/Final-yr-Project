import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function LocationConfirmationPanel({
  location,
  coordinates,
  isResolving = false,
  onConfirm,
  serviceName,
}) {
  const latDisplay = coordinates
    ? `${Math.abs(coordinates.lat).toFixed(4)}° ${coordinates.lat >= 0 ? 'N' : 'S'}`
    : '';
  const lngDisplay = coordinates
    ? `${Math.abs(coordinates.lng).toFixed(4)}° ${coordinates.lng >= 0 ? 'E' : 'W'}`
    : '';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #D9D7D0',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.10)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        userSelect: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Main Location Title & Geographic Details */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              color: '#242424',
              marginBottom: '3px',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {location?.name || 'Selected Coordinate'}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.8rem', color: '#66645F' }}>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {[location?.region, location?.country].filter(Boolean).join(', ')}
            </span>
            {coordinates && (
              <>
                <span style={{ color: '#D9D7D0' }}>•</span>
                <span style={{ fontFamily: 'monospace', color: '#8E712C', fontWeight: '600', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>
                  {latDisplay} · {lngDisplay}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Resolving indicator */}
        {isResolving && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#B08D3C', flexShrink: 0, paddingTop: '2px' }}>
            <Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
            <span>Locating…</span>
          </div>
        )}
      </div>

      {/* Climate Zone & Elevation only (no renewable score) */}
      {location && (location.climateZone || location.elevation) && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#F7F6F2',
            border: '1px solid #E5E3DD',
            fontSize: '0.76rem',
          }}
        >
          {location.climateZone && (
            <div>
              <div style={{ color: '#8A8882', fontSize: '0.64rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Climate Zone</div>
              <div style={{ fontWeight: '700', color: '#242424' }}>{location.climateZone}</div>
            </div>
          )}
          {location.elevation && (
            <div>
              <div style={{ color: '#8A8882', fontSize: '0.64rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>Elevation</div>
              <div style={{ fontWeight: '700', color: '#242424' }}>{location.elevation} m</div>
            </div>
          )}
        </div>
      )}

      {/* Guidance note & CTA Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <p style={{ fontSize: '0.72rem', color: '#8A8882', margin: 0 }}>
          Move the map to refine the pin.
        </p>

        <button
          onClick={onConfirm}
          className="btn-gold"
          style={{
            padding: '10px 22px',
            fontSize: '0.88rem',
            fontWeight: '700',
            borderRadius: '9px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Check style={{ width: '16px', height: '16px' }} />
          <span>Confirm Location</span>
        </button>
      </div>
    </div>
  );
}
