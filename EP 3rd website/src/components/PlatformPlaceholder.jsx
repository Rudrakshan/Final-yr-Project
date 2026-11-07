import React from 'react';
import { Globe, ArrowLeft, Sparkles, Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function PlatformPlaceholder({ onNavigate }) {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={brandIconStyle}>
            <Globe style={{ width: '18px', height: '18px', color: '#00f2fe' }} />
          </div>
          <span style={brandTitleStyle}>
            Eco<span style={{ color: '#00f2fe' }}>Predict</span> Platform
          </span>
        </div>

        <button onClick={() => onNavigate('landing')} style={backButtonStyle}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Exit to Landing Page</span>
        </button>
      </header>

      <main style={mainContentStyle}>
        <div className="glass-panel" style={cardStyle}>
          <div style={badgeStyle}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
            PHASE 3 PLATFORM ENGINE
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            Welcome to the EcoPredict Platform
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Authentication successful! Your personalized environmental analysis dashboard and AI telemetry portal are currently preparing for Phase 3.
          </p>

          <div style={gridStyle}>
            <div style={statCardStyle}>
              <Activity style={{ color: '#00f2fe', width: '24px', height: '24px', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Connected Sources</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>Active Feeds</div>
            </div>

            <div style={statCardStyle}>
              <Cpu style={{ color: '#10b981', width: '24px', height: '24px', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Personal AI Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>Standby Ready</div>
            </div>

            <div style={statCardStyle}>
              <ShieldCheck style={{ color: '#c084fc', width: '24px', height: '24px', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>User Session</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>Authenticated</div>
            </div>
          </div>

          <button onClick={() => onNavigate('landing')} className="btn-primary" style={{ marginTop: '32px' }}>
            <span>Return to Landing Page</span>
          </button>
        </div>
      </main>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#030508',
  color: '#f8fafc',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '24px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const brandIconStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(16,185,129,0.2) 100%)',
  border: '1px solid rgba(0,242,254,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const brandTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: '700',
  fontFamily: 'var(--font-heading)',
  color: '#fff',
};

const backButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#94a3b8',
  fontSize: '0.85rem',
  fontWeight: '500',
  cursor: 'pointer',
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
};

const cardStyle = {
  maxWidth: '680px',
  width: '100%',
  padding: '48px 40px',
  textAlign: 'center',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  fontSize: '0.78rem',
  fontWeight: '600',
  color: '#10b981',
  marginBottom: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '16px',
};

const statCardStyle = {
  backgroundColor: 'rgba(5, 7, 12, 0.7)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
