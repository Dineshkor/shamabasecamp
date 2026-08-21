'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const DAY_STAGES = [
  {
    time: '05:30 AM',
    label: 'Dawn',
    title: 'The Mountain Awakens',
    description: 'Watch the high Himalayan peaks catch the very first rays of sun, painting the sky in soft shades of amber and apricot. Hot herbal tea is served on your cottage veranda as the valley below wakes up.',
    image: '/images/secondcampimage.jpg',
    alt: 'Alpenglow on snowy peaks at dawn'
  },
  {
    time: '09:30 AM',
    label: 'Morning Trail',
    title: 'Oak & Rhododendron Trails',
    description: 'Venture into Shama’s ancient woodlands. Walk along agricultural terraces, cross mountain streams, and learn local stories from guides who know every tree and peak by name.',
    image: '/images/sixteenimage.jpg',
    alt: 'Trails surrounding Shama village cottages'
  },
  {
    time: '04:00 PM',
    label: 'Afternoon Solitude',
    title: 'Hearthfire & Mountain Brews',
    description: 'As the shadows lengthen across the Saryu Valley, return for freshly brewed mountain coffee, hot ginger chai, and Kumaoni flatbreads. It is the perfect time for writing, reading, or simply listening to the silence.',
    image: '/images/twelveimage.jpg',
    alt: 'Golden light on peaks during sunset'
  },
  {
    time: '08:00 PM',
    label: 'Hearth & Stars',
    title: 'A Cathedral of Stars',
    description: 'Gather around the wood hearth in the stone cottage for dinner. Outside, with zero light pollution, the night sky transforms into a glittering vault where the Milky Way is visible to the naked eye.',
    image: '/images/tenimage.jpg',
    alt: 'Warm cozy interiors and night retreat vibe'
  }
];

export default function Rhythms() {
  const [activeStage, setActiveStage] = useState(0);
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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="rhythms" className="section" ref={sectionRef} style={{ background: 'var(--sand-dark)' }}>
      <div className="section-inner">
        <div className="section-header reveal">
          <h2>Rhythms of Shama</h2>
          <div className="section-divider"></div>
          <p>A day shaped by mountain sunlight, cozy fires, and the stars</p>
        </div>

        <div className="rhythms__container reveal reveal-delay-2">
          {/* Left Column - Clickable Milestones */}
          <div className="rhythms__tabs-list">
            {DAY_STAGES.map((stage, index) => (
              <button
                key={index}
                className={`rhythms__tab-btn${activeStage === index ? ' rhythms__tab-btn--active' : ''}`}
                onClick={() => setActiveStage(index)}
              >
                <div className="rhythms__tab-indicator">
                  {stage.time.split(' ')[0]}
                </div>
                <div className="rhythms__tab-info">
                  <span>{stage.label}</span>
                  <h3>{stage.title}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Showcase Screen */}
          <div className="rhythms__showcase">
            <Image
              src={DAY_STAGES[activeStage].image}
              alt={DAY_STAGES[activeStage].alt}
              fill
              sizes="(max-width: 992px) 100vw, 55vw"
              className="rhythms__showcase-img"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="rhythms__showcase-overlay">
              <h4>{DAY_STAGES[activeStage].time} — {DAY_STAGES[activeStage].title}</h4>
              <p>{DAY_STAGES[activeStage].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
