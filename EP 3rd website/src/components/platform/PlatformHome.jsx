import React from 'react';
import { 
  Sun, 
  Building2, 
  TrendingUp, 
  Sliders, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Wind, 
  ShieldAlert, 
  Layers
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export default function PlatformHome({ onSelectService }) {
  const { selectedLocation, openLocationSelector } = useLocation();

  return (
    <div style={{ padding: '44px 8%', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Top Location Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '14px 22px',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9D7D0',
          marginBottom: '48px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#F4EEDC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B08D3C',
            }}
          >
            <MapPin style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
              CURRENT LOCATION
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#242424' }}>
              {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.region}, ${selectedLocation.country}` : 'Coimbatore, Tamil Nadu, India'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: '#66645F' }}>
            {selectedLocation ? `Lat: ${selectedLocation.latitude}° • Lng: ${selectedLocation.longitude}°` : ''}
          </span>
          <button
            onClick={() => openLocationSelector('home')}
            className="btn-outline"
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <MapPin style={{ width: '14px', height: '14px', color: '#B08D3C' }} />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* Main Section Header */}
      <div style={{ textAlign: 'left', maxWidth: '820px', marginBottom: '44px' }}>
        <div className="badge-gold" style={{ marginBottom: '16px' }}>
          Environmental Intelligence Platform
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
            fontWeight: '800',
            lineHeight: 1.18,
            marginBottom: '12px',
            color: '#242424',
            letterSpacing: '-0.025em',
          }}
        >
          What would you like to explore?
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#66645F',
            lineHeight: 1.6,
          }}
        >
          Understand environmental conditions, evaluate opportunities and explore what could happen next.
        </p>
      </div>

      {/* Four Differentiated Service Sections (Core Requirement #7) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', marginBottom: '60px' }}>
        {/* Service 1: Renewable Energy */}
        <div
          className="editorial-card"
          onClick={() => onSelectService('energy')}
          style={{
            padding: '32px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '3px solid #B08D3C',
            minHeight: '340px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#F4EEDC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B08D3C',
                }}
              >
                <Sun style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Service 01
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#242424', marginBottom: '6px' }}>
              Renewable Energy
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#8E712C', fontWeight: '600', marginBottom: '14px' }}>
              Generation Potential & Strategy
            </div>

            <p style={{ fontSize: '0.92rem', color: '#66645F', lineHeight: 1.6, marginBottom: '20px' }}>
              Find the renewable-energy strategy that fits your location and requirements. Compare solar, wind, biomass, and hydro.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B08D3C', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Explore Energy</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </div>
        </div>

        {/* Service 2: Site Suitability */}
        <div
          className="editorial-card"
          onClick={() => onSelectService('site')}
          style={{
            padding: '32px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '3px solid #2E7D5B',
            minHeight: '340px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#EBF4F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2E7D5B',
                }}
              >
                <Building2 style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Service 02
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#242424', marginBottom: '6px' }}>
              Site Suitability
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#2E7D5B', fontWeight: '600', marginBottom: '14px' }}>
              Environmental Site Assessment
            </div>

            <p style={{ fontSize: '0.92rem', color: '#66645F', lineHeight: 1.6, marginBottom: '20px' }}>
              Evaluate environmental conditions before choosing a location for your plan: residential, commercial, industrial, or agriculture.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B08D3C', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Evaluate a Site</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </div>
        </div>

        {/* Service 3: Risk & Future */}
        <div
          className="editorial-card"
          onClick={() => onSelectService('risk')}
          style={{
            padding: '32px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '3px solid #B7791F',
            minHeight: '340px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B7791F',
                }}
              >
                <TrendingUp style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Service 03
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#242424', marginBottom: '6px' }}>
              Risk & Future
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#B7791F', fontWeight: '600', marginBottom: '14px' }}>
              Environmental Risk & Trend Modeling
            </div>

            <p style={{ fontSize: '0.92rem', color: '#66645F', lineHeight: 1.6, marginBottom: '20px' }}>
              Understand environmental risks and how conditions could change over time. Analyze extreme heat, heavy rainfall, flood, and drought.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B08D3C', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Analyze Risk</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </div>
        </div>

        {/* Service 4: Scenario Lab */}
        <div
          className="editorial-card"
          onClick={() => onSelectService('scenario')}
          style={{
            padding: '32px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '3px solid #77756F',
            minHeight: '340px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#F1F0EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3A3A37',
                }}
              >
                <Sliders style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Service 04
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#242424', marginBottom: '6px' }}>
              Scenario Lab
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#77756F', fontWeight: '600', marginBottom: '14px' }}>
              Simulation & "What If?" Exploration
            </div>

            <p style={{ fontSize: '0.92rem', color: '#66645F', lineHeight: 1.6, marginBottom: '20px' }}>
              Change environmental conditions and explore how the outcome changes. Simulate temperature increases, rainfall shifts, and demand peaks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B08D3C', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Run a Scenario</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
