import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { 
  Sun,
  Wind, 
  Thermometer, 
  CloudRain, 
  Droplets,
  Layers, 
  Sparkles, 
  ChevronDown, 
  ArrowRight,
  Compass,
  MessageSquare,
  Globe2,
  Cpu,
  Building2,
  TrendingUp,
  Sliders
} from 'lucide-react';

const SCENE_CONFIGS = [
  { start: 0.00, end: 0.09 },
  { start: 0.13, end: 0.22 },
  { start: 0.26, end: 0.35 },
  { start: 0.39, end: 0.48 },
  { start: 0.52, end: 0.61 },
  { start: 0.65, end: 0.74 },
  { start: 0.78, end: 0.87 },
  { start: 0.91, end: 1.00 },
];

const getSceneOpacity = (p, start, end) => {
  const fadeInWindow = 0.035;
  const fadeOutWindow = 0.035;

  if (p < start - fadeInWindow || p > end + fadeOutWindow) return 0;
  if (p >= start && p <= end) return 1;
  if (p < start) return (p - (start - fadeInWindow)) / fadeInWindow;
  return 1 - (p - end) / fadeOutWindow;
};

const CinematicOverlay = forwardRef(({ onNavigate }, ref) => {
  const sceneRefs = useRef([]);
  const lastOpacitiesRef = useRef(new Float32Array(8));

  const applyProgress = (p) => {
    for (let i = 0; i < 8; i++) {
      const el = sceneRefs.current[i];
      if (!el) continue;

      const { start, end } = SCENE_CONFIGS[i];
      const opacity = getSceneOpacity(p, start, end);
      const prevOpacity = lastOpacitiesRef.current[i];

      if (Math.abs(opacity - prevOpacity) > 0.001) {
        lastOpacitiesRef.current[i] = opacity;
        if (opacity <= 0) {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          el.style.transform = 'translate3d(0, 20px, 0)';
        } else {
          el.style.opacity = opacity.toFixed(3);
          el.style.visibility = 'visible';
          el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
          const translateY = ((1 - opacity) * 20).toFixed(1);
          el.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    updateProgress(progress) {
      applyProgress(progress);
    }
  }));

  useEffect(() => {
    // Initial scene 1 activation
    applyProgress(0);
  }, []);

  const pillars = [
    { title: 'Energy', desc: 'Renewable potential across solar, wind, hydro & biomass', icon: <Sun style={{ color: '#F6C75E' }} /> },
    { title: 'Environment', desc: 'Site suitability, soil, air, water & local ecology', icon: <Layers style={{ color: '#6DBF87' }} /> },
    { title: 'Risk', desc: 'Extreme heat, flood inundation, drought & climate trends', icon: <TrendingUp style={{ color: '#E08B6C' }} /> },
    { title: 'Future', desc: 'Scenario simulation for changing climate conditions', icon: <Sliders style={{ color: '#A98DE8' }} /> },
  ];

  const fourServices = [
    { 
      number: '01', 
      title: 'Renewable Energy', 
      desc: 'Evaluate optimal solar, wind, biomass & hybrid systems for any site.',
      icon: <Sun style={{ color: '#F6C75E', width: '20px', height: '20px' }} />,
      accent: '#F6C75E'
    },
    { 
      number: '02', 
      title: 'Site Suitability', 
      desc: 'Assess environmental conditions for residential, commercial or agriculture plans.',
      icon: <Building2 style={{ color: '#6DBF87', width: '20px', height: '20px' }} />,
      accent: '#6DBF87'
    },
    { 
      number: '03', 
      title: 'Risk & Future Prediction', 
      desc: 'Understand forward risk factors, heat stress, flood vulnerability and projected trends.',
      icon: <TrendingUp style={{ color: '#E08B6C', width: '20px', height: '20px' }} />,
      accent: '#E08B6C'
    },
    { 
      number: '04', 
      title: 'Scenario Lab', 
      desc: 'Simulate what happens if temperature rises, rainfall shifts, or energy demand grows.',
      icon: <Sliders style={{ color: '#A98DE8', width: '20px', height: '20px' }} />,
      accent: '#A98DE8'
    }
  ];

  const parameters = [
    { label: 'Solar Irradiance', val: 'Direct & Diffuse' },
    { label: 'Wind Velocity Profile', val: 'Corridor & Gusts' },
    { label: 'Thermal Stress Index', val: 'Extreme Heat Trends' },
    { label: 'Hydrologic Runoff', val: 'Flood Inundation' },
    { label: 'Air Quality Dynamics', val: 'Particulate Density' },
    { label: 'Soil Moisture & Drought', val: 'Aridity Indices' },
  ];

  const aiQuestions = [
    "Which renewable energy mix is most cost-effective for my location?",
    "How will extreme rainfall risks in this region change by 2040?",
    "Is this terrain environmentally suitable for a commercial facility?"
  ];

  const commonSectionStyle = {
    position: 'fixed',
    inset: 0,
    willChange: 'transform, opacity',
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* SCENE 1 — INTRODUCTION */}
      <section
        id="scene-1"
        ref={el => sceneRefs.current[0] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'visible',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          opacity: 1,
          transform: 'translate3d(0, 0px, 0)',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '860px' }}>
          {/* Platform Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(196, 169, 110, 0.12)',
              border: '1px solid rgba(196, 169, 110, 0.4)',
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#C4A96E',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '28px',
            }}
          >
            <Globe2 style={{ width: '12px', height: '12px' }} />
            ECOPREDICT PLATFORM
          </div>

          <h1
            className="gradient-text"
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
              fontWeight: '800',
              lineHeight: 1.1,
              marginBottom: '22px',
              letterSpacing: '-0.03em',
            }}
          >
            Environmental Intelligence<br />for Better Decisions.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
              color: 'rgba(224, 220, 208, 0.8)',
              lineHeight: 1.75,
              maxWidth: '660px',
              margin: '0 auto 40px auto',
              fontWeight: '400',
            }}
          >
            Explore real-world environmental conditions for any place on Earth.
            Evaluate renewable energy, analyze site suitability, forecast forward risks, and test future scenarios.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate ? onNavigate('platform') : null}
              className="btn-primary-dark"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 30px',
                backgroundColor: '#C4A96E',
                border: '1px solid #B08D3C',
                color: '#1A1610',
                fontWeight: '700',
                fontSize: '0.95rem',
                borderRadius: '10px',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4B87A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C4A96E'; e.currentTarget.style.transform = 'none'; }}
            >
              <span>Explore EcoPredict</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('auth') : null}
              className="btn-ghost-dark"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.88)',
                fontWeight: '500',
                fontSize: '0.95rem',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
            >
              <span>Account Login</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(196, 169, 110, 0.7)',
            fontSize: '0.72rem',
            fontWeight: '600',
            letterSpacing: '0.1em',
          }}
        >
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown style={{ width: '18px', height: '18px', animation: 'pulseGlow 1.5s infinite' }} />
        </div>
      </section>

      {/* SCENE 2 — CHANGING PLANET */}
      <section
        id="scene-2"
        ref={el => sceneRefs.current[1] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 8%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '560px',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(109, 191, 135, 0.12)',
              border: '1px solid rgba(109, 191, 135, 0.35)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#6DBF87',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            OUR CHANGING PLANET
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: '700',
              lineHeight: 1.2,
              marginBottom: '20px',
              color: '#F0ECE2',
            }}
          >
            Our environment is constantly changing.
          </h2>

          <p
            style={{
              fontSize: '1.02rem',
              color: 'rgba(196, 192, 180, 0.85)',
              lineHeight: 1.75,
              marginBottom: '16px',
            }}
          >
            Weather patterns are shifting, temperature volatility is accelerating, and localized risk profiles differ dramatically even within neighboring regions.
          </p>

          <p
            style={{
              fontSize: '1.02rem',
              color: 'rgba(196, 192, 180, 0.85)',
              lineHeight: 1.75,
              marginBottom: '24px',
            }}
          >
            Making sustainable choices for energy, construction, and planning requires clear, localized environmental intelligence.
          </p>

          <div
            style={{
              borderLeft: '3px solid #C4A96E',
              paddingLeft: '16px',
              color: '#E8DFC8',
              fontSize: '1.05rem',
              fontWeight: '500',
              fontStyle: 'italic',
            }}
          >
            Actionable intelligence replaces uncertainty.
          </div>
        </div>
      </section>

      {/* SCENE 3 — HOLISTIC ASSESSMENT */}
      <section
        id="scene-3"
        ref={el => sceneRefs.current[2] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 8%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '580px',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(109, 191, 135, 0.12)',
              border: '1px solid rgba(109, 191, 135, 0.3)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#6DBF87',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Globe2 style={{ width: '12px', height: '12px' }} />
            HOLISTIC SITE UNDERSTANDING
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: '700',
              lineHeight: 1.2,
              marginBottom: '18px',
              color: '#F0ECE2',
            }}
          >
            Understanding a location requires more than a single environmental parameter.
          </h2>

          <p
            style={{
              fontSize: '1.02rem',
              color: 'rgba(196, 192, 180, 0.85)',
              lineHeight: 1.75,
              marginBottom: '22px',
            }}
          >
            A high temperature reading doesn't explain renewable suitability. A rainfall gauge alone cannot forecast future flood risks or soil moisture deficit.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {parameters.map((param, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#E8DFC8' }}>{param.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(196, 192, 180, 0.6)' }}>{param.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 4 — FOUR PILLARS */}
      <section
        id="scene-4"
        ref={el => sceneRefs.current[3] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(196, 169, 110, 0.12)',
              border: '1px solid rgba(196, 169, 110, 0.35)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#C4A96E',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            CORE INTELLIGENCE PILLARS
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: '800',
              color: '#F0ECE2',
              marginBottom: '12px',
              letterSpacing: '-0.025em',
            }}
          >
            Energy. Environment. Risk. Future.
          </h2>

          <p style={{ color: 'rgba(196, 192, 180, 0.8)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            EcoPredict synthesizes multidimensional environmental vectors into clear decision intelligence.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            width: '100%',
            maxWidth: '1040px',
          }}
        >
          {pillars.map((pil, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                borderRadius: '14px',
                textAlign: 'left',
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {pil.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F0ECE2', marginBottom: '8px' }}>
                {pil.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(196, 192, 180, 0.75)', lineHeight: 1.55 }}>
                {pil.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SCENE 5 — ONE PLATFORM */}
      <section
        id="scene-5"
        ref={el => sceneRefs.current[4] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '720px',
            padding: '48px 44px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(196, 169, 110, 0.12)',
              border: '1px solid rgba(196, 169, 110, 0.35)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#C4A96E',
              marginBottom: '22px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            UNIFIED PLATFORM
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: '800',
              color: '#F0ECE2',
              marginBottom: '18px',
              lineHeight: 1.2,
            }}
          >
            One platform.<br />Multiple environmental decisions.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(196, 192, 180, 0.82)',
              lineHeight: 1.75,
              maxWidth: '600px',
              margin: '0 auto 28px auto',
            }}
          >
            Whether you are choosing clean power for a building, planning a new facility, mitigating climate risk, or testing "What If" scenarios, you don't need disconnected tools. EcoPredict unifies every step.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Single Location Context', 'Cross-Service Intelligence', 'Cohesive Experience'].map((item, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  color: 'rgba(224, 220, 208, 0.8)',
                  fontWeight: '500',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#6DBF87', display: 'inline-block', flexShrink: 0 }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 6 — THE FOUR SERVICES */}
      <section
        id="scene-6"
        ref={el => sceneRefs.current[5] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '720px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(109, 191, 135, 0.12)',
              border: '1px solid rgba(109, 191, 135, 0.3)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#6DBF87',
              marginBottom: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            DESIGNED FOR ACTION
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
              fontWeight: '700',
              color: '#F0ECE2',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Four Dedicated Decision Services.
          </h2>

          <p style={{ color: 'rgba(196, 192, 180, 0.75)', fontSize: '0.98rem' }}>
            Built around the questions real decision-makers ask:
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '14px',
            width: '100%',
            maxWidth: '1080px',
          }}
        >
          {fourServices.map((srv, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '24px 20px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `2px solid ${srv.accent}30`,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '9px', backgroundColor: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {srv.icon}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'rgba(196, 192, 180, 0.45)', letterSpacing: '0.06em' }}>
                    {srv.number}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F0ECE2', marginBottom: '8px' }}>
                  {srv.title}
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'rgba(196, 192, 180, 0.72)', lineHeight: 1.55 }}>
                  {srv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCENE 7 — AI-POWERED ANALYSIS */}
      <section
        id="scene-7"
        ref={el => sceneRefs.current[6] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6%',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            maxWidth: '780px',
            width: '100%',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '20px',
              backgroundColor: 'rgba(169, 141, 232, 0.12)',
              border: '1px solid rgba(169, 141, 232, 0.3)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#A98DE8',
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Sparkles style={{ width: '12px', height: '12px' }} />
            INTELLIGENT ENVIRONMENTAL ANALYSIS
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: '700',
              lineHeight: 1.25,
              marginBottom: '14px',
              color: '#F0ECE2',
            }}
          >
            AI-Powered Environmental Interpretation.
          </h2>

          <p
            style={{
              fontSize: '0.98rem',
              color: 'rgba(196, 192, 180, 0.82)',
              lineHeight: 1.7,
              marginBottom: '26px',
            }}
          >
            Environmental data is complex. EcoPredict includes an integrated assistant that understands your selected location, the service you are evaluating, and provides clear explanations in plain language.
          </p>

          {/* Context Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aiQuestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <MessageSquare style={{ width: '14px', height: '14px', color: '#A98DE8', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: '#E8DFC8', fontWeight: '500' }}>
                  "{q}"
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 8 — CLOSING & CALL TO ACTION */}
      <section
        id="scene-8"
        ref={el => sceneRefs.current[7] = el}
        style={{
          ...commonSectionStyle,
          display: 'flex',
          visibility: 'hidden',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          opacity: 0,
          transform: 'translate3d(0, 20px, 0)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            padding: '52px 44px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(196, 169, 110, 0.12)',
              border: '1px solid rgba(196, 169, 110, 0.35)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#C4A96E',
              marginBottom: '22px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            <Globe2 style={{ width: '12px', height: '12px' }} />
            ECOPREDICT
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: '800',
              color: '#F0ECE2',
              marginBottom: '16px',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
            }}
          >
            Ready to explore?
          </h2>

          <p
            style={{
              fontSize: '1.08rem',
              color: 'rgba(196, 192, 180, 0.82)',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '560px',
              margin: '0 auto 36px auto',
            }}
          >
            Enter the EcoPredict platform. Select a service, explore the interactive Earth to pick your location, and uncover environmental intelligence.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate ? onNavigate('platform') : null}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 34px',
                backgroundColor: '#C4A96E',
                border: '1px solid #B08D3C',
                color: '#1A1610',
                fontWeight: '700',
                fontSize: '1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4B87A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C4A96E'; e.currentTarget.style.transform = 'none'; }}
            >
              <span>EXPLORE ECOPREDICT</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('auth') : null}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 30px',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.88)',
                fontWeight: '500',
                fontSize: '1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
            >
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
});

export default CinematicOverlay;
