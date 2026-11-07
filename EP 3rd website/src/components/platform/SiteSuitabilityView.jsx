import React, { useState } from 'react';
import { 
  Building2, 
  Wind, 
  Thermometer, 
  CloudRain, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { calculateSiteSuitability } from '../../data/mockServicesData';

export default function SiteSuitabilityView({ onOpenEarthSelector }) {
  const { selectedLocation } = useLocation();
  const [activityType, setActivityType] = useState('Commercial');

  const activityOptions = [
    'Residential',
    'Commercial',
    'Industrial',
    'Agriculture',
    'Infrastructure',
    'Renewable Installation'
  ];

  const profile = calculateSiteSuitability(selectedLocation, activityType);

  const getMetricIcon = (icon) => {
    switch (icon) {
      case 'Wind': return <Wind style={{ width: '18px', height: '18px', color: '#77756F' }} />;
      case 'Thermometer': return <Thermometer style={{ width: '18px', height: '18px', color: '#B7791F' }} />;
      case 'CloudRain': return <CloudRain style={{ width: '18px', height: '18px', color: '#2B6CB0' }} />;
      case 'Droplets': return <Droplets style={{ width: '18px', height: '18px', color: '#3182CE' }} />;
      default: return <Sparkles style={{ width: '18px', height: '18px', color: '#B08D3C' }} />;
    }
  };

  return (
    <div style={{ padding: '40px 8%', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="badge-gold" style={{ marginBottom: '12px' }}>
          Service 02 • Site Assessment
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Environmental Site Suitability
        </h1>
        <p style={{ color: '#66645F', fontSize: '1.05rem' }}>
          Evaluate environmental conditions before choosing a location for your development or activity plan.
        </p>
      </div>

      {/* Planned Activity Selector */}
      <div
        className="editorial-card"
        style={{
          padding: '28px',
          marginBottom: '36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#242424', marginBottom: '4px' }}>
              Could this location support your plan?
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#66645F' }}>
              <span>Evaluating:</span>
              <strong style={{ color: '#242424' }}>{selectedLocation.name}, {selectedLocation.country}</strong>
              <button
                onClick={onOpenEarthSelector}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  paddingLeft: '4px'
                }}
              >
                Change Location
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {activityOptions.map((opt) => {
            const isSelected = activityType === opt;
            return (
              <button
                key={opt}
                onClick={() => setActivityType(opt)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                  border: isSelected ? '1px solid #B08D3C' : '1px solid #D9D7D0',
                  color: isSelected ? '#8E712C' : '#66645F',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERALL ENVIRONMENTAL SITE PROFILE */}
      <div
        className="editorial-card"
        style={{
          padding: '36px 40px',
          borderLeft: '4px solid #2E7D5B',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#8A8882', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            ENVIRONMENTAL SITE PROFILE
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '6px' }}>
            {profile.locationName}
          </h2>
          <div style={{ fontSize: '1.05rem', color: '#2E7D5B', fontWeight: '600', marginBottom: '10px' }}>
            Suitability for {activityType} Development
          </div>
          <p style={{ color: '#66645F', maxWidth: '620px', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Synthesized against localized terrain elevation ({selectedLocation.elevation}m), thermal profile, flood drainage, and air dispersion factors.
          </p>
        </div>

        {/* Overall Score Circle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            backgroundColor: '#EBF4F0',
            border: '2px solid #2E7D5B',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '2.6rem', fontWeight: '800', color: '#2E7D5B', lineHeight: 1 }}>
            {profile.overallScore}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#8A8882', fontWeight: '600' }}>
            out of 100
          </span>
        </div>
      </div>

      {/* Profile Breakdown Factor Meters */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#242424', marginBottom: '18px' }}>
          Environmental Factor Breakdown
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {profile.profileMetrics.map((met, idx) => (
            <div
              key={idx}
              className="editorial-card"
              style={{
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#F7F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getMetricIcon(met.icon)}
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#242424' }}>
                  {met.score}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#242424', marginBottom: '4px' }}>
                {met.name}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#66645F', marginBottom: '12px' }}>
                Status: <strong style={{ color: '#3A3A37' }}>{met.status}</strong>
              </div>

              <div style={{ height: '4px', backgroundColor: '#E5E3DD', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${met.score}%`,
                    height: '100%',
                    backgroundColor: met.score >= 70 ? '#2E7D5B' : '#B7791F',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Concerns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Strengths */}
        <div
          className="editorial-card"
          style={{
            padding: '24px 28px',
            borderLeft: '4px solid #2E7D5B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <CheckCircle2 style={{ width: '18px', height: '18px', color: '#2E7D5B' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424' }}>
              Site Strengths
            </h4>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profile.strengths.map((str, idx) => (
              <li key={idx} style={{ fontSize: '0.86rem', color: '#3A3A37', lineHeight: 1.5 }}>
                • {str}
              </li>
            ))}
          </ul>
        </div>

        {/* Concerns */}
        <div
          className="editorial-card"
          style={{
            padding: '24px 28px',
            borderLeft: '4px solid #B7791F',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertCircle style={{ width: '18px', height: '18px', color: '#B7791F' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424' }}>
              Concerns & Mitigation Needs
            </h4>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profile.concerns.length > 0 ? (
              profile.concerns.map((con, idx) => (
                <li key={idx} style={{ fontSize: '0.86rem', color: '#3A3A37', lineHeight: 1.5 }}>
                  • {con}
                </li>
              ))
            ) : (
              <li style={{ fontSize: '0.86rem', color: '#8A8882' }}>
                No acute environmental vulnerabilities detected.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Prototype Disclaimer */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: '8px',
          backgroundColor: '#F1F0EB',
          border: '1px solid #D9D7D0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#66645F',
          fontSize: '0.8rem',
        }}
      >
        <Info style={{ width: '16px', height: '16px', color: '#B08D3C', flexShrink: 0 }} />
        <span>{profile.disclaimer}</span>
      </div>
    </div>
  );
}
