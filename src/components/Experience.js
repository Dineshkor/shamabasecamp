'use client';

import { useEffect, useRef } from 'react';

const activities = [
  {
    icon: '🥾',
    title: 'Himalayan Trails',
    description:
      'Walk through ancient forests of oak and rhododendron. Trails lead to hidden waterfalls, shepherd meadows, and panoramic ridges with views of Nanda Devi and Panchachuli.',
  },
  {
    icon: '🌄',
    title: 'Sunrise & Sunset',
    description:
      'Watch the first light paint the snow peaks gold from your cottage doorstep. Evenings bring alpenglow that turns the mountains into fire.',
  },
  {
    icon: '🐦',
    title: 'Birdwatching',
    description:
      "Over 200 Himalayan bird species call these forests home — from the vibrant Himalayan Monal to the melodic Whistling Thrush. A birder's paradise.",
  },
  {
    icon: '🍲',
    title: 'Village Cuisine',
    description:
      'Taste authentic Kumaoni meals — hand-ground spices, locally grown millets, seasonal vegetables from our garden, and chai brewed over a wood fire.',
  },
  {
    icon: '✨',
    title: 'Stargazing',
    description:
      'At 2,100m with zero light pollution, the night sky is a cathedral of stars. See the Milky Way stretch from horizon to horizon on clear nights.',
  },
  {
    icon: '🏘️',
    title: 'Village Walks',
    description:
      'Stroll through Shama Village, meet the families who have lived here for generations, visit ancient temples, and learn the stories woven into every stone wall.',
  },
];

export default function Experience() {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="experience" className="section section-dark" ref={sectionRef} style={{ backgroundColor: 'var(--pine-dark)' }}>
      <div className="section-inner">
        <div className="section-header reveal">
          <h2>The Shama Experience</h2>
          <div className="section-divider"></div>
          <p style={{ color: 'var(--amber-light)' }}>Days shaped by nature, not notifications</p>
        </div>

        <div className="experience__grid">
          {activities.map((activity, index) => (
            <div
              key={activity.title}
              className={`experience__card reveal reveal-delay-${(index % 4) + 1}`}
            >
              <div className="experience__num">
                {String(index + 1).padStart(2, '0')}
              </div>
              <span className="experience__icon">{activity.icon}</span>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
