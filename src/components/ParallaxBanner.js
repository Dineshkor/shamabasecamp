import Image from "next/image";

export default function ParallaxBanner({ image, alt, title, subtitle }) {
  return (
    <section className="parallax-banner">
      <div className="parallax-banner__bg">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          quality={85}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="parallax-banner__overlay" />
      <div className="parallax-banner__content">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
