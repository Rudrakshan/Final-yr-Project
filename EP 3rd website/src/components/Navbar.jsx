import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrolled = window.scrollY > 50;
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? '14px 40px' : '22px 40px',
        backgroundColor: scrolled ? 'rgba(6, 8, 14, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand Logo & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => scrollToRatio(0.0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'rgba(196, 169, 110, 0.15)',
              border: '1px solid rgba(196, 169, 110, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Globe style={{ width: '18px', height: '18px', color: '#C4A96E' }} />
          </div>
          <span
            style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em',
              color: '#F0ECE2',
            }}
          >
            Eco<span style={{ color: '#C4A96E' }}>Predict</span>
          </span>
        </button>

        {/* Live Platform Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(109, 191, 135, 0.1)',
            border: '1px solid rgba(109, 191, 135, 0.25)',
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#6DBF87',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span className="live-indicator" />
          Environmental Intelligence
        </div>
      </div>

      {/* Nav Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <button onClick={() => scrollToRatio(0.0)} style={navBtnStyle}>Home</button>
        <button onClick={() => scrollToRatio(0.28)} style={navBtnStyle}>How It Works</button>
        <button onClick={() => scrollToRatio(0.67)} style={navBtnStyle}>Services</button>
        <button onClick={() => scrollToRatio(0.80)} style={navBtnStyle}>AI Analysis</button>
        <button onClick={() => scrollToRatio(0.15)} style={navBtnStyle}>About</button>
      </nav>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => onNavigate ? onNavigate('auth') : null}
          style={signInBtnStyle}
        >
          Sign In
        </button>
        <button
          onClick={() => onNavigate ? onNavigate('platform') : null}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 20px',
            backgroundColor: '#C4A96E',
            border: '1px solid #B08D3C',
            color: '#1A1610',
            fontWeight: '700',
            fontSize: '0.86rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4B87A'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C4A96E'; }}
        >
          <span>Enter EcoPredict</span>
          <ArrowUpRight style={{ width: '15px', height: '15px' }} />
        </button>
      </div>
    </header>
  );
}

const scrollToRatio = (ratio) => {
  const totalScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
  window.scrollTo({
    top: totalScroll * ratio,
    behavior: 'smooth',
  });
};

const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(224, 220, 208, 0.65)',
  fontSize: '0.86rem',
  fontWeight: '500',
  transition: 'color 0.2s ease',
  cursor: 'pointer',
  padding: '6px 10px',
  borderRadius: '6px',
};

const signInBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(224, 220, 208, 0.75)',
  fontSize: '0.88rem',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '8px 12px',
};
