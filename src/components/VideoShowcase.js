'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoShowcase() {
  const sectionRef = useRef(null);
  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  const [isVid2Playing, setIsVid2Playing] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealElements = section.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Intersection-based autoplay for vid1 (cinematic background)
  useEffect(() => {
    const vid = vid1Ref.current;
    if (!vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(vid);
    return () => observer.disconnect();
  }, []);

  // Intersection-based autoplay for vid2 (portrait reel)
  useEffect(() => {
    const vid = vid2Ref.current;
    if (!vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
            setIsVid2Playing(true);
          } else {
            vid.pause();
            setIsVid2Playing(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(vid);
    return () => observer.disconnect();
  }, []);

  const toggleVid2 = () => {
    const vid = vid2Ref.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsVid2Playing(true);
    } else {
      vid.pause();
      setIsVid2Playing(false);
    }
  };

  return (
    <section id="video-showcase" ref={sectionRef}>
      {/* ─── PART 1: Cinematic Full-Bleed Video Banner ─── */}
      <div className="vshow__cinematic reveal">
        <video
          ref={vid1Ref}
          className="vshow__cinematic-video"
          src="/videos/vid1.mp4"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="vshow__cinematic-overlay" />
        <div className="vshow__cinematic-content">
          <span className="vshow__cinematic-eyebrow">Experience Shama</span>
          <h2 className="vshow__cinematic-title">
            Feel the Silence,<br />Hear the Mountains
          </h2>
          <p className="vshow__cinematic-sub">
            A glimpse into the rhythm of life at 2,500 metres — 
            where mornings begin with birdsong and evenings end with stars.
          </p>
        </div>
        {/* Decorative corner frames */}
        <div className="vshow__corner vshow__corner--tl" />
        <div className="vshow__corner vshow__corner--br" />
      </div>

      {/* ─── PART 2: Portrait Reel + Text Grid ─── */}
      <div className="vshow__reel-section section">
        <div className="section-inner">
          <div className="vshow__reel-grid">
            {/* Left: Text Content */}
            <div className="vshow__reel-text reveal">
              <span className="vshow__reel-eyebrow">Stories from the Ridge</span>
              <h2>Life Unfolds<br />Differently Here</h2>
              <div className="section-divider" style={{ margin: 'var(--space-md) 0' }} />
              <p>
                Watch the mist roll through the Saryu valley at dawn. See the light 
                paint the Trishul and Nanda Devi peaks in gold. This is not a curated 
                experience — it is daily life at Shama Basecamp.
              </p>
              <p>
                Every visit writes its own story. The trails change with the seasons, 
                the kitchen serves whatever the garden gives, and the sky puts on a 
                different show each night.
              </p>
              <div className="vshow__reel-stats">
                <div className="vshow__reel-stat">
                  <span className="vshow__reel-stat-val">27s</span>
                  <span className="vshow__reel-stat-lbl">of stillness</span>
                </div>
                <div className="vshow__reel-stat">
                  <span className="vshow__reel-stat-val">∞</span>
                  <span className="vshow__reel-stat-lbl">memories to make</span>
                </div>
              </div>
            </div>

            {/* Right: Portrait Video in Phone Frame */}
            <div className="vshow__reel-frame-wrap reveal reveal-delay-2">
              <div className="vshow__reel-frame" onClick={toggleVid2}>
                <div className="vshow__reel-notch" />
                <video
                  ref={vid2Ref}
                  className="vshow__reel-video"
                  src="/videos/vid2.mp4"
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className={`vshow__reel-play-btn ${isVid2Playing ? 'vshow__reel-play-btn--hidden' : ''}`}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" opacity="0.6"/>
                    <polygon points="19,14 36,24 19,34" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                {/* Ambient glow behind the frame */}
                <div className="vshow__reel-glow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
