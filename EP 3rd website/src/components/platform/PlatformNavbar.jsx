import React from 'react';
import { 
  Globe, 
  MapPin, 
  Sparkles, 
  Sun, 
  Building2, 
  TrendingUp, 
  Sliders, 
  LogOut, 
  User,
  Compass
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export default function PlatformNavbar({ currentTab, onSelectTab, onNavigate, onToggleAI }) {
  const { selectedLocation, openLocationSelector } = useLocation();

  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'energy', label: 'Energy' },
    { id: 'site', label: 'Site' },
    { id: 'risk', label: 'Risk' },
    { id: 'scenario', label: 'Scenario Lab' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #D9D7D0',
        padding: '12px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <button
          onClick={() => onSelectTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: '#242424',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#B08D3C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Globe style={{ width: '17px', height: '17px' }} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#242424', letterSpacing: '-0.02em' }}>
            Eco<span style={{ color: '#B08D3C' }}>Predict</span>
          </span>
        </button>

        {/* Center: Clean Nav Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  position: 'relative',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#F4EEDC' : 'transparent',
                  border: 'none',
                  color: isActive ? '#8E712C' : '#66645F',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '14px',
                      right: '14px',
                      height: '2px',
                      backgroundColor: '#B08D3C',
                    }}
                  />
                )}
              </button>
            );
          })}

          <button
            onClick={onToggleAI}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#B08D3C',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>AI Assistant</span>
          </button>
        </nav>
      </div>

      {/* Right: Location & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Selected Location Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: '#F7F6F2',
            border: '1px solid #D9D7D0',
            fontSize: '0.82rem',
          }}
        >
          <MapPin style={{ width: '13px', height: '13px', color: '#B08D3C' }} />
          <span style={{ fontWeight: '600', color: '#242424' }}>
            {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.country}` : 'Select Location'}
          </span>
          <button
            onClick={() => openLocationSelector(currentTab)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8E712C',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              paddingLeft: '4px',
            }}
          >
            Change
          </button>
        </div>

        {/* Return to Landing */}
        <button
          onClick={() => onNavigate('landing')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            border: '1px solid #D9D7D0',
            color: '#66645F',
            fontSize: '0.82rem',
            fontWeight: '500',
            cursor: 'pointer',
          }}
          title="Exit to Landing"
        >
          <LogOut style={{ width: '13px', height: '13px' }} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
}
