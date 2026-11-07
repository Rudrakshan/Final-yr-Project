import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';

const FRAME_COUNT = 180;
const PROXIMITY_BUFFER = 15;
const ANCHOR_STEP = 5;

const EarthCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const imageCacheRef = useRef(new Map()); // Map<frameIndex, HTMLImageElement>
  const pendingLoadsRef = useRef(new Set()); // Set<frameIndex>
  const priorityQueueRef = useRef([]); // Array<frameIndex>
  const currentTargetFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);
  const prefersReducedMotionRef = useRef(false);

  // Determine mobile status and appropriate DPR cap
  const getDprAndMobile = () => {
    const isMobile = typeof window !== 'undefined' && 
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent || ''));
    const maxDpr = isMobile ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const maxConcurrent = isMobile ? 2 : 4;
    return { isMobile, dpr, maxConcurrent };
  };

  // Queue drainer with concurrency limit
  const drainQueue = () => {
    const { maxConcurrent } = getDprAndMobile();
    const pending = pendingLoadsRef.current;
    const queue = priorityQueueRef.current;
    const cache = imageCacheRef.current;

    while (pending.size < maxConcurrent && queue.length > 0) {
      const nextIndex = queue.shift();
      if (cache.has(nextIndex) || pending.has(nextIndex)) {
        continue;
      }

      pending.add(nextIndex);

      const img = new Image();
      const frameNum = String(nextIndex + 1).padStart(3, '0');
      img.src = `/earth-frames/frame_${frameNum}.webp`;

      const onFrameDecoded = () => {
        pending.delete(nextIndex);
        cache.set(nextIndex, img);

        // If this frame is the current target frame, render it
        if (currentTargetFrameRef.current === nextIndex) {
          drawCanvas(nextIndex);
        }
        drainQueue();
      };

      if ('decode' in img) {
        img.decode()
          .then(onFrameDecoded)
          .catch(() => {
            img.onload = onFrameDecoded;
            img.onerror = () => {
              pending.delete(nextIndex);
              drainQueue();
            };
          });
      } else {
        img.onload = onFrameDecoded;
        img.onerror = () => {
          pending.delete(nextIndex);
          drainQueue();
        };
      }
    }
  };

  // Re-prioritize preload queue based on current scroll target frame
  const queueFramesAround = (centerIndex) => {
    const cache = imageCacheRef.current;
    const pending = pendingLoadsRef.current;
    const newQueue = [];

    // Priority 1: Current target frame
    if (!cache.has(centerIndex) && !pending.has(centerIndex)) {
      newQueue.push(centerIndex);
    }

    // Priority 2: Rolling proximity buffer (±PROXIMITY_BUFFER)
    for (let offset = 1; offset <= PROXIMITY_BUFFER; offset++) {
      const nextF = centerIndex + offset;
      const prevF = centerIndex - offset;
      if (nextF < FRAME_COUNT && !cache.has(nextF) && !pending.has(nextF)) {
        newQueue.push(nextF);
      }
      if (prevF >= 0 && !cache.has(prevF) && !pending.has(prevF)) {
        newQueue.push(prevF);
      }
    }

    // Priority 3: Keyframe anchors (every 5th frame)
    for (let i = 0; i < FRAME_COUNT; i += ANCHOR_STEP) {
      if (!cache.has(i) && !pending.has(i) && !newQueue.includes(i)) {
        newQueue.push(i);
      }
    }

    // Priority 4: All remaining frames in background
    for (let i = 0; i < FRAME_COUNT; i++) {
      if (!cache.has(i) && !pending.has(i) && !newQueue.includes(i)) {
        newQueue.push(i);
      }
    }

    priorityQueueRef.current = newQueue;
    drainQueue();
  };

  // High-performance canvas drawing function (reusing dimensions, zero layout triggers)
  const drawCanvas = (targetFrame) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frameToDraw = prefersReducedMotionRef.current ? 0 : targetFrame;

    // Skip redundant draw
    if (lastRenderedFrameRef.current === frameToDraw && canvas.dataset.rendered === 'true') {
      return;
    }

    // Lookup frame image or nearest loaded anchor
    let img = imageCacheRef.current.get(frameToDraw);
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame to eliminate any frame flashing or blank screens
      let nearestDist = Infinity;
      let fallbackImg = null;

      imageCacheRef.current.forEach((cachedImg, idx) => {
        if (cachedImg.complete && cachedImg.naturalWidth > 0) {
          const dist = Math.abs(idx - frameToDraw);
          if (dist < nearestDist) {
            nearestDist = dist;
            fallbackImg = cachedImg;
          }
        }
      });
      img = fallbackImg;
    }

    if (!img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    lastRenderedFrameRef.current = frameToDraw;
    canvas.dataset.rendered = 'true';

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, width, height);

    // Aspect ratio cover algorithm
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) * 0.5;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) * 0.5;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  // Resize handler — only resizes canvas on mount and window resize, NEVER during scroll
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const { dpr } = getDprAndMobile();

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    dimensionsRef.current = { width, height, dpr };
    canvas.dataset.rendered = 'false';
    lastRenderedFrameRef.current = -1;

    drawCanvas(currentTargetFrameRef.current);
  };

  // Expose imperative controller to App's single centralized RAF scroll loop
  useImperativeHandle(ref, () => ({
    updateProgress(progress) {
      const targetFrame = Math.min(
        FRAME_COUNT - 1, 
        Math.max(0, Math.floor(progress * (FRAME_COUNT - 1)))
      );

      currentTargetFrameRef.current = targetFrame;
      queueFramesAround(targetFrame);
      drawCanvas(targetFrame);
    }
  }));

  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Initial canvas setup
    handleResize();

    // Load Frame 1 immediately with high priority
    const frame1 = new Image();
    frame1.src = '/earth-frames/frame_001.webp';
    const onFrame1Ready = () => {
      imageCacheRef.current.set(0, frame1);
      setInitialFrameLoaded(true);
      drawCanvas(0);
      // Start queueing nearby frames
      queueFramesAround(0);
    };

    if ('decode' in frame1) {
      frame1.decode().then(onFrame1Ready).catch(() => {
        frame1.onload = onFrame1Ready;
      });
    } else {
      frame1.onload = onFrame1Ready;
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        objectFit: 'cover',
        opacity: initialFrameLoaded ? 1 : 0,
        transition: 'opacity 0.4s ease-in',
        willChange: 'transform',
      }}
    />
  );
});

export default EarthCanvas;
