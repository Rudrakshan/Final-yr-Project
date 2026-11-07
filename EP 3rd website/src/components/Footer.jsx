import React from 'react';
import { Globe, Leaf, ArrowRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#030508',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        padding: '60px 8% 40px 8%',
        color: 'rgba(196, 192, 180, 0.7)',
        fontSize: '0.88rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '44px',
          marginBottom: '52px',
        }}
      >
        {/* Col 1: Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(196, 169, 110, 0.15)',
                border: '1px solid rgba(196, 169, 110, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe style={{ width: '17px', height: '17px', color: '#C4A96E' }} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#F0ECE2', fontFamily: 'var(--font-heading)' }}>
              Eco<span style={{ color: '#C4A96E' }}>Predict</span>
            </span>
          </div>
          <p style={{ lineHeight: 1.65, color: 'rgba(196, 192, 180, 0.55)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Environmental Intelligence Platform helping users understand conditions and make informed decisions across energy, site suitability, risk, and future scenarios.
          </p>
          <button
            onClick={() => onNavigate ? onNavigate('platform') : null}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 18px',
              backgroundColor: '#C4A96E',
              border: '1px solid #B08D3C',
              color: '#1A1610',
              fontWeight: '700',
              fontSize: '0.82rem',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4B87A'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C4A96E'; }}
          >
            <span>Launch Platform</span>
            <ArrowRight style={{ width: '13px', height: '13px' }} />
          </button>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 style={{ color: '#E8DFC8', fontSize: '0.88rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.04em' }}>
            Four Decision Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><button onClick={() => onNavigate ? onNavigate('platform/energy') : null} style={footerBtnStyle}>01 Renewable Energy Advisor</button></li>
            <li><button onClick={() => onNavigate ? onNavigate('platform/site') : null} style={footerBtnStyle}>02 Site Suitability Evaluator</button></li>
            <li><button onClick={() => onNavigate ? onNavigate('platform/risk') : null} style={footerBtnStyle}>03 Risk & Future Prediction</button></li>
            <li><button onClick={() => onNavigate ? onNavigate('platform/scenario') : null} style={footerBtnStyle}>04 EcoPredict Scenario Lab</button></li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div>
          <h4 style={{ color: '#E8DFC8', fontSize: '0.88rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.04em' }}>
            Platform Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><button onClick={() => scrollToRatio(0.0)} style={footerBtnStyle}>Home & Cinematic Earth</button></li>
            <li><button onClick={() => scrollToRatio(0.28)} style={footerBtnStyle}>How It Works</button></li>
            <li><button onClick={() => scrollToRatio(0.67)} style={footerBtnStyle}>The 4 Services</button></li>
            <li><button onClick={() => scrollToRatio(0.80)} style={footerBtnStyle}>AI Environmental Intelligence</button></li>
            <li>
              <button
                onClick={() => onNavigate ? onNavigate('auth') : null}
                style={{ ...footerBtnStyle, color: '#C4A96E' }}
              >
                Account Login & Sign Up
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Vision */}
        <div>
          <h4 style={{ color: '#E8DFC8', fontSize: '0.88rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.04em' }}>
            Environmental Intelligence
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'rgba(196, 192, 180, 0.55)', lineHeight: 1.65 }}>
            EcoPredict connects multi-source satellite and climate observations into actionable decision support, helping individuals and planners navigate complex environmental factors with confidence.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.78rem',
          color: 'rgba(196, 192, 180, 0.4)',
        }}
      >
        <div>
          © {new Date().getFullYear()} EcoPredict Intelligence Platform. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Built with <Leaf style={{ width: '13px', height: '13px', color: '#6DBF87' }} /> for Environmental Decision Intelligence.
        </div>
      </div>
    </footer>
  );
}

const scrollToRatio = (ratio) => {
  const totalScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
  window.scrollTo({
    top: totalScroll * ratio,
    behavior: 'smooth',
  });
};

const footerBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(196, 192, 180, 0.6)',
  fontSize: '0.85rem',
  transition: 'color 0.2s ease',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
};
