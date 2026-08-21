import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero">
      {/* Background Image with Ken Burns zoom */}
      <div className="hero__bg hero__bg-ken-burns">
        <Image
          src="/images/seventhcampimage.jpg"
          alt="Stone cottage at Shama Brews and Base surrounded by autumn flowers in the Kumaon Himalayas"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="hero__overlay" />

      {/* Frame Overlay */}
      <div className="hero__frame" />

      {/* Content — staggered fade-ins */}
      <div className="hero__content">
        <p
          className="hero__subtitle hero__fade-in"
          style={{ animationDelay: '0s' }}
        >
          Kumaon Himalayas · 2,100m · Off-Grid
        </p>
        <h1
          className="hero__title hero__fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Shama Brews and Base
        </h1>
        <p
          className="hero__tagline hero__fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          Where silence speaks and the mountains listen
        </p>
        <div
          className="hero__cta-group hero__fade-in"
          style={{ animationDelay: '1.2s' }}
        >
          <a href="#booking" className="hero__cta hero__cta--primary">
            Book Your Stay
          </a>
          <a href="#about" className="hero__cta hero__cta--secondary">
            Explore
          </a>
        </div>
      </div>

      {/* Soft gradient fade at bottom (replaces mountain SVG divider) */}
      <div className="hero__fade-bottom" />

      {/* Scroll Indicator — appears last */}
      <div
        className="hero__scroll hero__fade-in"
        style={{ animationDelay: '2.5s' }}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
