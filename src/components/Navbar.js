'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Getting There', href: '#getting-there' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const navbarClass = `navbar ${scrolled ? 'navbar--solid' : 'navbar--transparent'}`;

  return (
    <nav className={navbarClass}>
      {/* Logo */}
      <a href="#" className="navbar__logo" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '40px', height: '40px', overflow: 'hidden', borderRadius: '50%' }}>
          <Image
            src="/images/logo.png"
            alt="Shama Basecamp Logo"
            fill
            sizes="40px"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div>
          <div className="navbar__logo-text" style={{ lineHeight: '1.1' }}>Shama Basecamp</div>
          <div className="navbar__logo-sub" style={{ fontSize: '0.6rem', marginTop: '2px' }}>Kumaon Himalayas</div>
        </div>
      </a>

      {/* Desktop Links */}
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a className="navbar__link" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <a className="navbar__cta" href="#booking">
            Book Now
          </a>
        </li>
      </ul>

      {/* Mobile Hamburger Toggle */}
      <button
        className={`navbar__toggle ${mobileOpen ? 'navbar__toggle--open' : ''}`}
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            className="navbar__mobile-link"
            href={link.href}
            onClick={handleLinkClick}
          >
            {link.label}
          </a>
        ))}
        <a
          className="navbar__cta"
          href="#booking"
          onClick={handleLinkClick}
          style={{ marginTop: '1rem' }}
        >
          Book Now
        </a>
      </div>
    </nav>
  );
}
