'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const galleryImages = [
  { src: '/images/seventhcampimage.jpg', alt: 'Stone cottage in autumn', caption: 'The Base Cottage', className: 'gallery__item--tall' },
  { src: '/images/sixthcampimage.jpg', alt: 'River valley panorama', caption: 'Saryu Valley Views' },
  { src: '/images/secondcampimage.jpg', alt: 'Alpenglow on peaks', caption: 'Alpenglow at Dawn', className: 'gallery__item--wide' },
  { src: '/images/eightcampimage.jpg', alt: 'Cottage with marigolds', caption: 'Marigold Season' },
  { src: '/images/thirdcampimage.jpg', alt: 'Peak at dusk', caption: 'Peak at Dusk' },
  { src: '/images/fourthcampimage.jpg', alt: 'Mountain layers at dusk', caption: 'Layered Horizons', className: 'gallery__item--tall' },
  { src: '/images/fifthcampimage.jpg', alt: 'Dramatic snow peak', caption: 'The Sentinel' },
  { src: '/images/nineimage.jpg', alt: 'Cottage with orchid flowers', caption: 'Spring Blossoms' },
  { src: '/images/tenimage.jpg', alt: 'Cozy bedroom', caption: 'Your Mountain Room', className: 'gallery__item--wide' },
  { src: '/images/elevenimage.jpg', alt: 'Mountain peak', caption: 'Evening Peak' },
  { src: '/images/twelveimage.jpg', alt: 'Golden peak sunset', caption: 'Golden Hour' },
  { src: '/images/thirteenimage.jpg', alt: 'Rustic bedroom', caption: 'Wooden Warmth' },
  { src: '/images/fourteenimage.jpg', alt: 'Peak at golden hour', caption: 'Fire & Ice' },
  { src: '/images/fifteenimage.jpg', alt: 'Massive close peak', caption: 'The Great Wall' },
  { src: '/images/sixteenimage.jpg', alt: 'Cottage with blossoms', caption: 'Solar-Powered Living' },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const gridRef = useRef(null);

  const isLightboxOpen = lightboxIndex !== null;

  // --- Intersection Observer for reveal animation ---
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const items = gridEl.querySelectorAll('.gallery__item');

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

    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // --- Lightbox navigation helpers ---
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, []);

  // --- Keyboard events for lightbox ---
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, closeLightbox, goToPrev, goToNext]);

  // --- Handle overlay click (close only when clicking the backdrop, not the image) ---
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        closeLightbox();
      }
    },
    [closeLightbox]
  );

  return (
    <section id="gallery" className="section">
      <div className="section-inner">
        {/* Section header */}
        <div className="section-header">
          <h2>Moments from the Mountains</h2>
          <p>Every view is a painting you get to live in</p>
        </div>
        <div className="section-divider" />

        {/* Masonry-style grid */}
        <div className="gallery__grid" ref={gridRef}>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`gallery__item reveal${image.className ? ` ${image.className}` : ''}`}
              style={{ transitionDelay: `${(index % 5) * 80}ms` }}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="gallery__item-overlay">
                <span>{image.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <div
        className={`lightbox${isLightboxOpen ? ' lightbox--open' : ''}`}
        onClick={handleOverlayClick}
      >
        {isLightboxOpen && (
          <>
            {/* Close button */}
            <button
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Previous button */}
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={goToPrev}
              aria-label="Previous image"
            >
              ←
            </button>

            {/* Lightbox image — unoptimized for full-res display */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lightbox__image"
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
            />

            {/* Next button */}
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={goToNext}
              aria-label="Next image"
            >
              →
            </button>

            {/* Caption */}
            <div className="lightbox__caption">
              {galleryImages[lightboxIndex].caption}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
