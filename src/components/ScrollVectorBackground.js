'use client';

import { useEffect, useRef } from 'react';

export default function ScrollVectorBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const container = containerRef.current;
          if (container) {
            // Set css variables based on scroll position to drive GPU-accelerated transforms
            container.style.setProperty('--scroll-y', `${scrollY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to initialize positions
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="scroll-bg" ref={containerRef} aria-hidden="true">
      <svg
        className="scroll-bg__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {/* Winding Wind Currents Path 1 */}
        <path
          className="scroll-bg__path scroll-bg__path--wind-1"
          d="M -100 150 C 300 -50, 700 350, 1100 100 C 1300 0, 1500 200, 1600 150"
        />

        {/* Winding Wind Currents Path 2 */}
        <path
          className="scroll-bg__path scroll-bg__path--wind-2"
          d="M -100 450 C 200 650, 600 250, 1000 550 C 1200 700, 1400 450, 1600 500"
        />

        {/* Saryu River Flow Path (dashed, flowing texture) */}
        <path
          className="scroll-bg__path scroll-bg__path--river"
          d="M -100 750 C 400 850, 500 500, 950 700 C 1200 800, 1350 650, 1600 800"
        />
        
        {/* Subtle decorative circles (zen pebbles in the stream) */}
        <circle className="scroll-bg__pebble scroll-bg__pebble--1" cx="300" cy="250" r="4" />
        <circle className="scroll-bg__pebble scroll-bg__pebble--2" cx="850" cy="580" r="6" />
        <circle className="scroll-bg__pebble scroll-bg__pebble--3" cx="1200" cy="320" r="3" />
      </svg>
    </div>
  );
}
