import React, { useState } from 'react';
import { 
  Sliders, 
  Thermometer, 
  CloudRain, 
  Zap, 
  Sun, 
  RotateCcw, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { calculateScenarioImpact } from '../../data/mockServicesData';

export default function ScenarioLabView({ onOpenEarthSelector }) {
  const { selectedLocation } = useLocation();

  // Slider State
  const [tempDelta, setTempDelta] = useState(1.5);
  const [rainfallDelta, setRainfallDelta] = useState(-15);
  const [energyDemandDelta, setEnergyDemandDelta] = useState(20);
  const [solarAvailabilityDelta, setSolarAvailabilityDelta] = useState(0);

  // Dynamic reactive impact calculation
  const impact = calculateScenarioImpact(selectedLocation, {
    tempDelta,
    rainfallDelta,
    energyDemandDelta,
    solarAvailabilityDelta
  });

  const resetToBaseline = () => {
    setTempDelta(0);
    setRainfallDelta(0);
    setEnergyDemandDelta(0);
    setSolarAvailabilityDelta(0);
  };

  return (
    <div style={{ padding: '40px 8%', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="badge-gold" style={{ marginBottom: '12px' }}>
          Service 04 • Environmental Modeling
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Scenario Lab
        </h1>
        <p style={{ color: '#66645F', fontSize: '1.05rem' }}>
          Change environmental conditions and explore how the outcome changes for your location.
        </p>
      </div>

      {/* Location Context Bar */}
      <div
        className="editorial-card"
        style={{
          padding: '16px 24px',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <MapPin style={{ width: '16px', height: '16px', color: '#B08D3C' }} />
          <span style={{ fontSize: '0.92rem', color: '#242424' }}>
            Simulation Target: <strong>{selectedLocation.name}, {selectedLocation.country}</strong>
          </span>
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
              paddingLeft: '2px'
            }}
          >
            Change Location
          </button>
          <span style={{ fontSize: '0.78rem', color: '#8A8882' }}>
            (Baseline: {selectedLocation.baseTemp}°C, {selectedLocation.baseRainfall}mm rain)
          </span>
        </div>

        <button
          onClick={resetToBaseline}
          className="btn-outline"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <RotateCcw style={{ width: '12px', height: '12px' }} />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* TWO-COLUMN WORKSPACE: SLIDERS (LEFT) vs REAL-TIME IMPACT (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        {/* LEFT: MINIMAL PROFESSIONAL SLIDERS */}
        <div
          className="editorial-card"
          style={{
            padding: '32px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#242424', marginBottom: '6px' }}>
            Environmental Parameters
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#66645F', marginBottom: '28px' }}>
            Adjust the sliders to simulate changing climate and operational factors.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* Slider 1: Temperature Delta */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#242424' }}>
                  <Thermometer style={{ width: '15px', height: '15px', color: '#B7791F' }} />
                  <span>Temperature Shift</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#B08D3C', fontFamily: 'monospace' }}>
                  {tempDelta >= 0 ? `+${tempDelta}` : tempDelta}°C
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.5"
                value={tempDelta}
                onChange={(e) => setTempDelta(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8A8882', marginTop: '4px' }}>
                <span>-2.0°C</span>
                <span>Baseline (0.0°C)</span>
                <span>+5.0°C</span>
              </div>
            </div>

            {/* Slider 2: Rainfall Delta */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#242424' }}>
                  <CloudRain style={{ width: '15px', height: '15px', color: '#2B6CB0' }} />
                  <span>Rainfall Fluctuation</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#B08D3C', fontFamily: 'monospace' }}>
                  {rainfallDelta >= 0 ? `+${rainfallDelta}` : rainfallDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={rainfallDelta}
                onChange={(e) => setRainfallDelta(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8A8882', marginTop: '4px' }}>
                <span>-50% (Drought)</span>
                <span>Baseline (0%)</span>
                <span>+50% (Surge)</span>
              </div>
            </div>

            {/* Slider 3: Energy Demand Delta */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#242424' }}>
                  <Zap style={{ width: '15px', height: '15px', color: '#77756F' }} />
                  <span>Facility Energy Demand Peak</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#B08D3C', fontFamily: 'monospace' }}>
                  {energyDemandDelta >= 0 ? `+${energyDemandDelta}` : energyDemandDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                step="5"
                value={energyDemandDelta}
                onChange={(e) => setEnergyDemandDelta(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8A8882', marginTop: '4px' }}>
                <span>-30%</span>
                <span>Baseline (0%)</span>
                <span>+60%</span>
              </div>
            </div>

            {/* Slider 4: Solar Availability */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#242424' }}>
                  <Sun style={{ width: '15px', height: '15px', color: '#B08D3C' }} />
                  <span>Solar Irradiance / Overcast Shift</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#B08D3C', fontFamily: 'monospace' }}>
                  {solarAvailabilityDelta >= 0 ? `+${solarAvailabilityDelta}` : solarAvailabilityDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={solarAvailabilityDelta}
                onChange={(e) => setSolarAvailabilityDelta(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8A8882', marginTop: '4px' }}>
                <span>-30% (Dense Clouds)</span>
                <span>Standard</span>
                <span>+30% (Clear Sky)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CURRENT CONDITIONS VS SCENARIO (EDITORIAL CARDS) */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* CURRENT BASELINE */}
            <div
              className="editorial-card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                CURRENT CONDITIONS
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#242424', marginBottom: '2px' }}>
                {impact.baseline.temperature}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#66645F', marginBottom: '14px' }}>
                Rainfall: {impact.baseline.rainfall}
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#F7F6F2', border: '1px solid #E5E3DD', fontSize: '0.78rem', color: '#3A3A37' }}>
                Suitability: <strong>{impact.baseline.renewableScore}/100</strong>
              </div>
            </div>

            {/* SCENARIO RESULT */}
            <div
              className="editorial-card"
              style={{
                padding: '24px',
                backgroundColor: '#F4EEDC',
                border: '1px solid #D7C28A',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#8E712C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                SCENARIO
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#242424', marginBottom: '2px' }}>
                {impact.scenario.temperature}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#66645F', marginBottom: '14px' }}>
                Rainfall: {impact.scenario.rainfall}
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #D9D7D0', fontSize: '0.78rem', color: '#242424' }}>
                Suitability: <strong>{impact.scenario.renewableScore}/100 ({impact.scenario.scoreDelta >= 0 ? `+${impact.scenario.scoreDelta}` : impact.scenario.scoreDelta})</strong>
              </div>
            </div>
          </div>

          {/* HAZARD & SECURITY METERS */}
          <div
            className="editorial-card"
            style={{
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              Simulated Hazard Shifts
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#66645F' }}>Thermal / Heat Stress Risk</span>
                  <span style={{ fontWeight: '700', color: '#242424' }}>{impact.scenario.heatRiskScore} / 100</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5E3DD', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${impact.scenario.heatRiskScore}%`, height: '100%', backgroundColor: '#B7791F', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#66645F' }}>Inundation & Flood Risk</span>
                  <span style={{ fontWeight: '700', color: '#242424' }}>{impact.scenario.floodRiskScore} / 100</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5E3DD', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${impact.scenario.floodRiskScore}%`, height: '100%', backgroundColor: '#2B6CB0', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#66645F' }}>Water Resource Resilience</span>
                  <span style={{ fontWeight: '700', color: '#242424' }}>{impact.scenario.waterSecurityScore} / 100</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#E5E3DD', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${impact.scenario.waterSecurityScore}%`, height: '100%', backgroundColor: '#2E7D5B', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* EDITORIAL TAKEAWAYS */}
          <div
            className="editorial-card"
            style={{
              padding: '20px 24px',
              borderLeft: '4px solid #B08D3C',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#242424', marginBottom: '8px' }}>
              Scenario Analysis
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {impact.insights.map((ins, idx) => (
                <li key={idx} style={{ fontSize: '0.84rem', color: '#66645F', lineHeight: 1.5 }}>
                  • {ins}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
