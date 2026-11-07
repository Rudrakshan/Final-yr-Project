import React, { useEffect, useRef, useState } from 'react';

export default function EarthVideo({ scrollProgress }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const targetTimeRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Load video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        setIsLoaded(true);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (video.readyState >= 1 && video.duration) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Smooth video currentTime scrubbing using lerp & requestAnimationFrame
  useEffect(() => {
    if (!isLoaded || duration <= 0) return;

    // Calculate target time based on scroll progress
    targetTimeRef.current = Math.min(duration, Math.max(0, scrollProgress * duration));

    const updateVideoTime = () => {
      const video = videoRef.current;
      if (!video) return;

      const target = targetTimeRef.current;
      const current = video.currentTime;
      const diff = target - current;

      // Linear interpolation for smooth seeking
      if (Math.abs(diff) > 0.01) {
        video.currentTime = current + diff * 0.2;
        animationFrameRef.current = requestAnimationFrame(updateVideoTime);
      } else {
        video.currentTime = target;
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress, isLoaded, duration]);

  return (
    <>
      {/* Loading Overlay for Video */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#05070c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: '#fff',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid rgba(0, 242, 254, 0.2)',
              borderTopColor: '#00f2fe',
              animation: 'spinSlow 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Loading Earth Video Stream...</span>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src="/Create_a_seamless_ultra_reali.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          backgroundColor: '#05070c',
        }}
      />
    </>
  );
}
