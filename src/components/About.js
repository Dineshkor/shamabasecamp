'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealElements = section.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__collage">
          {/* Left: Text & Stats */}
          <div className="about__text reveal">
            <h2>Rooted in the Mountains</h2>
            <p>
              Nestled at 2,500 metres in Shama Village, Bageshwar district,
              Shama Basecamp is a quiet corner of the Kumaon Himalayas where the
              rhythm of life follows the sun and seasons. Our stone-and-mud
              cottages, built in the traditional Kumaoni style, sit on a gentle
              ridge overlooking terraced fields and snow-capped peaks.
            </p>
            <p>
              This is not a hotel. It is a homecoming — to simpler mornings,
              wood-fire evenings, and the kind of silence that only mountains can
              hold. We live gently on this land, growing our own food, harvesting
              rainwater, and sharing what the village has always known: that less
              is more.
            </p>

            <div className="about__stats-circles">
              <div className="about__stat-circle">
                <div className="about__stat-val">2,500m</div>
                <div className="about__stat-lbl">Altitude</div>
              </div>
              <div className="about__stat-circle">
                <div className="about__stat-val">360°</div>
                <div className="about__stat-lbl">Views</div>
              </div>
              <div className="about__stat-circle">
                <div className="about__stat-val">Off-Grid</div>
                <div className="about__stat-lbl">Solar Powered</div>
              </div>
            </div>
          </div>

          {/* Right: Overlapping Collage */}
          <div className="about__collage-images reveal">
            <div className="about__collage-primary">
              <Image
                src="/images/eightcampimage.jpg"
                alt="Stone-and-mud cottage with marigolds at Shama Basecamp"
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="about__image-badge">
                <span>📍 Shama Village, Kumaon</span>
              </div>
            </div>
            <div className="about__collage-secondary">
              <Image
                src="/images/thirteenimage.jpg"
                alt="Rustic wooden cabin interior at Shama Basecamp"
                fill
                sizes="(max-width: 992px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
