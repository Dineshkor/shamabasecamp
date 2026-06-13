'use client';

import { useEffect, useRef } from 'react';

const routeSteps = [
  {
    icon: '✈️',
    title: 'Fly to Delhi',
    description:
      'Start your journey from Delhi (IGI Airport) or take an overnight train',
  },
  {
    icon: '🚂',
    title: 'Train to Kathgodam',
    description:
      'Board the Ranikhet Express or Uttar Sampark Kranti. Overnight journey through the plains (8-10 hours)',
  },
  {
    icon: '🚗',
    title: 'Drive to Bageshwar',
    description:
      'A scenic 6-hour drive through pine forests and river valleys via Almora or Kausani',
  },
  {
    icon: '🚕',
    title: 'Taxi to Shama Basecamp',
    description:
      'A 2-hour taxi ride from Bageshwar directly to the basecamp, climbing through scenic ridges to 2,500m',
  },
];

const infoCards = [
  { icon: '🏔️', label: 'Nearest Town', value: 'Bageshwar' },
  { icon: '🚉', label: 'Nearest Station', value: 'Kathgodam' },
  { icon: '✈️', label: 'Nearest Airport', value: 'Pantnagar' },
  { icon: '📍', label: 'Altitude', value: '~2,500m' },
];

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3436.58!2d80.0746247!3d29.9713456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a7270075b27e45%3A0x2aec78ca8a10915e!2sShama%20basecamp!5e0!3m2!1sen!2sin!4v1718100000000';

export default function GettingThere() {
  const sectionRef = useRef(null);

  useEffect(() => {
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

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => {
      revealElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="getting-there" className="section section-alt" ref={sectionRef}>
      <div className="section-inner">
        {/* Section Header */}
        <div className="section-header reveal">
          <h2>Getting Here</h2>
          <p>The journey is part of the experience</p>
        </div>
        <div className="section-divider reveal" />

        {/* Two-Column Layout */}
        <div className="getting-there__content">
          {/* LEFT — Route Steps */}
          <div className="reveal reveal-left">
            {routeSteps.map((step, index) => (
              <div className="route__step" key={index}>
                <div className="route__icon">
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '0.85rem' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="route__details">
                  <h3>{step.icon} &nbsp; {step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Google Maps */}
          <div className="getting-there__map reveal reveal-right">
            <iframe
              src={MAPS_EMBED_URL}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shama Village, Bageshwar — Google Maps"
            />
          </div>
        </div>

        {/* Info Cards */}
        <div className="getting-there__info-cards reveal">
          {infoCards.map((card, index) => (
            <div
              className={`info-card reveal reveal-delay-${index + 1}`}
              key={index}
            >
              <div className="info-card__icon">{card.icon}</div>
              <div className="info-card__label">{card.label}</div>
              <div className="info-card__value">{card.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
