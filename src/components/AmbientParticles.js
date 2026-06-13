'use client';

export default function AmbientParticles() {
  return (
    <div
      className="ambient-particles"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <span className="ambient-particles__dot" style={{ '--i': 0, '--size': 4 }} />
      <span className="ambient-particles__dot" style={{ '--i': 1, '--size': 6 }} />
      <span className="ambient-particles__dot" style={{ '--i': 2, '--size': 3 }} />
      <span className="ambient-particles__dot" style={{ '--i': 3, '--size': 7 }} />
      <span className="ambient-particles__dot" style={{ '--i': 4, '--size': 5 }} />
      <span className="ambient-particles__dot" style={{ '--i': 5, '--size': 8 }} />
      <span className="ambient-particles__dot" style={{ '--i': 6, '--size': 3 }} />
      <span className="ambient-particles__dot" style={{ '--i': 7, '--size': 6 }} />
      <span className="ambient-particles__dot" style={{ '--i': 8, '--size': 4 }} />
      <span className="ambient-particles__dot" style={{ '--i': 9, '--size': 7 }} />
      <span className="ambient-particles__dot" style={{ '--i': 10, '--size': 5 }} />
      <span className="ambient-particles__dot" style={{ '--i': 11, '--size': 8 }} />
    </div>
  );
}
