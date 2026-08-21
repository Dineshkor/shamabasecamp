'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoShowcase() {
  const sectionRef = useRef(null);
  const vid1Ref = useRef(null);
  const vid2Ref = useRef(null);
  const reelWrapRef = useRef(null);
  const [isVid2Playing, setIsVid2Playing] = useState(false);
  const [isVid2Muted, setIsVid2Muted] = useState(false);
  const isMutedRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isMutedRef.current = isVid2Muted;
  }, [isVid2Muted]);

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
    const wrap = reelWrapRef.current;
    const vid = vid2Ref.current;
    if (!wrap || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Attempt unmuted play first
            vid.muted = isMutedRef.current;
            vid.play()
              .catch((err) => {
                // If blocked and we were unmuted, fall back to muted autoplay
                if (!isMutedRef.current) {
                  console.log("Unmuted play blocked, falling back to muted autoplay");
                  vid.muted = true;
                  setIsVid2Muted(true);
                  vid.play().catch((e) => console.error("Muted play failed:", e));
                }
              });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const toggleVid2 = () => {
    const vid = vid2Ref.current;
    if (!vid) return;
    if (vid.paused) {
      // Unmute when user explicitly clicks to play
      vid.muted = false;
      setIsVid2Muted(false);
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const vid = vid2Ref.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsVid2Muted(vid.muted);
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
            A glimpse into the rhythm of life at 2,100 metres — 
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
            <div ref={reelWrapRef} className="vshow__reel-frame-wrap reveal reveal-delay-2">
              <div className="vshow__reel-frame" onClick={toggleVid2}>
                <div className="vshow__reel-notch" />
                <video
                  ref={vid2Ref}
                  className="vshow__reel-video"
                  src="/videos/vid2.mp4"
                  loop
                  playsInline
                  preload="metadata"
                  muted={isVid2Muted}
                  onPlay={() => setIsVid2Playing(true)}
                  onPause={() => setIsVid2Playing(false)}
                />
                <div className={`vshow__reel-play-btn ${isVid2Playing ? 'vshow__reel-play-btn--hidden' : ''}`}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" opacity="0.6"/>
                    <polygon points="19,14 36,24 19,34" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div className="vshow__reel-mute-btn" onClick={toggleMute}>
                  {isVid2Muted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  )}
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
