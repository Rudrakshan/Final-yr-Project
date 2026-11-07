import React, { useState } from 'react';
import { 
  TrendingUp, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Calendar, 
  Flame, 
  Droplets, 
  MapPin, 
  HelpCircle 
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { calculateRiskAndFuturePredictions } from '../../data/mockServicesData';

export default function RiskPredictionView({ onOpenEarthSelector }) {
  const { selectedLocation } = useLocation();
  const [selectedYear, setSelectedYear] = useState('2030');

  const riskData = calculateRiskAndFuturePredictions(selectedLocation);
  const activeProjection = riskData.timelineProjections.find(p => p.year === selectedYear) || riskData.timelineProjections[1];

  return (
    <div style={{ padding: '40px 8%', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="badge-gold" style={{ marginBottom: '12px' }}>
          Service 03 • Risk & Future Prediction
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Environmental Risk & Future Modeling
        </h1>
        <p style={{ color: '#66645F', fontSize: '1.05rem' }}>
          Analyze baseline environmental indicators and predict forward risks and multi-decade climate trends.
        </p>
      </div>

      {/* Location Bar */}
      <div
        className="editorial-card"
        style={{
          padding: '18px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            LOCATION IN FOCUS
          </span>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#242424' }}>
            {riskData.locationName}
          </div>
        </div>

        <button
          onClick={onOpenEarthSelector}
          className="btn-outline"
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Change Location
        </button>
      </div>

      {/* TIMELINE PROJECTION CONTROLLER (2024 to 2050) */}
      <div
        className="editorial-card"
        style={{
          padding: '32px',
          borderTop: '3px solid #B08D3C',
          marginBottom: '36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#8E712C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              FORWARD CLIMATE TIMELINE
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#242424' }}>
              What could happen here by {selectedYear}?
            </h3>
          </div>

          {/* Year Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {riskData.timelineProjections.map((proj) => {
              const isSelected = selectedYear === proj.year;
              return (
                <button
                  key={proj.year}
                  onClick={() => setSelectedYear(proj.year)}
                  style={{
                    padding: '7px 18px',
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
                  {proj.year}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scientific Projection Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F7F6F2', border: '1px solid #E5E3DD' }}>
            <div style={{ fontSize: '0.75rem', color: '#8A8882', marginBottom: '4px' }}>Projected Warming</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#B7791F' }}>{activeProjection.tempDelta}</div>
            <div style={{ fontSize: '0.75rem', color: '#66645F' }}>Mean: {activeProjection.avgTemp}°C</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F7F6F2', border: '1px solid #E5E3DD' }}>
            <div style={{ fontSize: '0.75rem', color: '#8A8882', marginBottom: '4px' }}>Extreme Heat Days</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8E712C' }}>{activeProjection.extremeHeatDays} days/yr</div>
            <div style={{ fontSize: '0.75rem', color: '#66645F' }}>Above 38°C threshold</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F7F6F2', border: '1px solid #E5E3DD' }}>
            <div style={{ fontSize: '0.75rem', color: '#8A8882', marginBottom: '4px' }}>Heavy Rain Storms</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2B6CB0' }}>{activeProjection.heavyRainEvents} events</div>
            <div style={{ fontSize: '0.75rem', color: '#66645F' }}>High-intensity bursts</div>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F7F6F2', border: '1px solid #E5E3DD' }}>
            <div style={{ fontSize: '0.75rem', color: '#8A8882', marginBottom: '4px' }}>Est. AQI Drift</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3A3A37' }}>{activeProjection.aqiIndex} AQI</div>
            <div style={{ fontSize: '0.75rem', color: '#66645F' }}>Dry-season baseline</div>
          </div>
        </div>
      </div>

      {/* FOUR RISK PROFILES */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#242424', marginBottom: '18px' }}>
          Environmental Risk Indicator Profiles
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '18px',
          }}
        >
          {riskData.riskCategories.map((rc) => (
            <div
              key={rc.id}
              className="editorial-card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424' }}>
                    {rc.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: rc.level === 'High' ? '#FEF2F2' : '#F4EEDC',
                      color: rc.level === 'High' ? '#C53030' : '#8E712C',
                      border: `1px solid ${rc.level === 'High' ? '#FECACA' : '#D7C28A'}`,
                    }}
                  >
                    {rc.level}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#8E712C', marginBottom: '8px' }}>
                  Trend: {rc.trend}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#66645F', lineHeight: 1.55, marginBottom: '16px' }}>
                  {rc.description}
                </p>
              </div>

              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#F7F6F2',
                  border: '1px solid #E5E3DD',
                  fontSize: '0.78rem',
                  color: '#3A3A37',
                }}
              >
                Key Impact: <strong>{rc.impactMetric}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical vs Projected Summary */}
      <div
        className="editorial-card"
        style={{
          padding: '24px 28px',
          backgroundColor: '#FFFFFF',
          borderLeft: '4px solid #77756F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp style={{ width: '18px', height: '18px', color: '#B08D3C' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424' }}>
            Historical Baseline vs Projected Trend Summary
          </h4>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#66645F', lineHeight: 1.6 }}>
          {riskData.historicalVsProjectedSummary}
        </p>
      </div>
    </div>
  );
}
