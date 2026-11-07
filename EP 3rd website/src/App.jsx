import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import EarthCanvas from './components/EarthCanvas';
import CinematicOverlay from './components/CinematicOverlay';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import PlatformHub from './components/platform/PlatformHub';
import { LocationProvider } from './context/LocationContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#auth') return 'auth';
    if (hash.startsWith('#platform')) return hash.slice(1);
    return 'landing';
  });

  const earthCanvasRef = useRef(null);
  const overlayRef = useRef(null);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    window.location.hash = page === 'landing' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#auth') {
        setCurrentPage('auth');
      } else if (hash.startsWith('#platform')) {
        setCurrentPage(hash.slice(1));
      } else {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Centralized Scroll Animation Controller (60 FPS, throttled RAF, Zero React state re-renders)
  useEffect(() => {
    if (currentPage !== 'landing') return;

    let ticking = false;
    let rafId = null;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const totalScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, scrollY / totalScroll)) : 0;

      // Update EarthCanvas and CinematicOverlay directly via refs (no React reconciliation)
      if (earthCanvasRef.current?.updateProgress) {
        earthCanvasRef.current.updateProgress(progress);
      }
      if (overlayRef.current?.updateProgress) {
        overlayRef.current.updateProgress(progress);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial sync
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentPage]);

  // Determine initial tab if navigating directly to a platform service (e.g. #platform/energy)
  let initialPlatformTab = 'home';
  if (currentPage.startsWith('platform/')) {
    initialPlatformTab = currentPage.split('/')[1] || 'home';
  }

  return (
    <LocationProvider>
      {currentPage === 'auth' ? (
        <AuthPage onNavigate={handleNavigate} />
      ) : currentPage.startsWith('platform') ? (
        <PlatformHub initialTab={initialPlatformTab} onNavigate={handleNavigate} />
      ) : (
        <div style={{ backgroundColor: '#05070c', minHeight: '100vh', color: '#f8fafc' }}>
          {/* Navigation Header */}
          <Navbar onNavigate={handleNavigate} />

          {/* Full-Screen HD 180-Frame Canvas Engine */}
          <EarthCanvas ref={earthCanvasRef} />

          {/* Cinematic Edge Vignette Depth Effect */}
          <div className="canvas-vignette" />

          {/* Scrollable Container (700vh height drives frame sequence 0 to 179 and 8 scenes) */}
          <div style={{ height: '700vh', position: 'relative' }}>
            <CinematicOverlay ref={overlayRef} onNavigate={handleNavigate} />
          </div>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} />
        </div>
      )}
    </LocationProvider>
  );
}
