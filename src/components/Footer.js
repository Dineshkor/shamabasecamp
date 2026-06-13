import Image from 'next/image';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Getting There', href: '#getting-there' },
  { label: 'Book Now', href: '#booking' },
];

const seasons = [
  { name: 'Spring', months: 'Mar–May' },
  { name: 'Summer', months: 'Jun–Sep' },
  { name: 'Autumn', months: 'Oct–Nov' },
  { name: 'Winter', months: 'Dec–Feb' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Four-Column Grid */}
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-sm)' }}>
              <div style={{ position: 'relative', width: '44px', height: '44px', overflow: 'hidden', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Image
                  src="/images/logo.png"
                  alt="Shama Basecamp Logo"
                  fill
                  sizes="44px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ margin: 0, color: 'var(--snow)' }}>Shama Basecamp</h3>
            </div>
            <p>
              A quiet corner of the Kumaon Himalayas, where the mountains teach
              you to breathe.
            </p>
            <div className="footer__social">
              <a
                href="https://www.instagram.com/shama_basecamp?igsh=NzBwNTk3MWh2NTZh"
                className="footer__social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                📷
              </a>
              <a
                href="https://facebook.com"
                className="footer__social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                📘
              </a>
              <a
                href="mailto:shamabasecamp@gmail.com"
                className="footer__social-link"
                aria-label="Email"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__links">
              <li>
                <span>Shama Village, Bageshwar District</span>
              </li>
              <li>
                <span>Uttarakhand 263641, India</span>
              </li>
              <li>
                <a href="mailto:shamabasecamp@gmail.com">
                  shamabasecamp@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919411727231">+91 94117 27231</a>
              </li>
            </ul>
          </div>

          {/* Seasons Column */}
          <div>
            <h4 className="footer__heading">Seasons</h4>
            <ul className="footer__links">
              {seasons.map((season) => (
                <li key={season.name}>
                  <span>
                    {season.name} ({season.months})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © 2025 Shama Basecamp. All rights reserved.
          </p>
          <span className="footer__eco">🌿 Eco-Friendly &amp; Off-Grid</span>
        </div>
      </div>
    </footer>
  );
}
