'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const FOCUS_IMAGES = [
  '/images/seventhcampimage.jpg',
  '/images/secondcampimage.jpg',
  '/images/fourthcampimage.jpg',
  '/images/fifthcampimage.jpg',
  '/images/twelveimage.jpg',
  '/images/fourteenimage.jpg',
];

const PEACEFUL_QUOTES = [
  { text: "Silence is not empty, it is full of answers.", author: "Rumi" },
  { text: "The mountains are calling, and I must go.", author: "John Muir" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "In the silence of the mountains, you find your own voice.", author: "Himalayan Proverb" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
  { text: "Climb the mountains and get their good tidings. Nature's peace will flow into you.", author: "John Muir" },
];

export default function ZenMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVol, setMasterVol] = useState(0.5);
  const [windVol, setWindVol] = useState(0.6);
  const [chimeVol, setChimeVol] = useState(0.4);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Slideshow States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Audio Graph Refs
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const windNodeRef = useRef(null);
  const windGainRef = useRef(null);
  const chimeDestinationRef = useRef(null);
  const chimesTimerRef = useRef(null);

  // Web Audio Initializer
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    // Create AudioContext
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = masterVol;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Wind Section
    const windGain = ctx.createGain();
    windGain.gain.value = windVol;
    windGain.connect(masterGain);
    windGainRef.current = windGain;

    // Generate White Noise Buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    // Bandpass filter for wind
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.6;
    filter.frequency.value = 350; // base frequency

    // Filter frequency modulator LFO (pitch waves)
    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.value = 0.05; // very slow
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.value = 120; // oscillate between 230Hz and 470Hz

    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(filter.frequency);

    // Wind Volume Modulator LFO (gusts)
    const volumeLfo = ctx.createOscillator();
    volumeLfo.frequency.value = 0.07;
    const volumeLfoGain = ctx.createGain();
    volumeLfoGain.gain.value = 0.035;

    const volumeGain = ctx.createGain();
    volumeGain.gain.value = 0.05; // base offset

    volumeLfo.connect(volumeLfoGain);
    volumeLfoGain.connect(volumeGain.gain);

    // Connect wind nodes
    windSource.connect(filter);
    filter.connect(volumeGain);
    volumeGain.connect(windGain);

    // Start Wind Modulators
    filterLfo.start();
    volumeLfo.start();
    windSource.start();

    // Save references to stop later
    windNodeRef.current = {
      source: windSource,
      filterLfo,
      volumeLfo,
      volumeGain
    };

    // Chimes section node destination (connects straight to master)
    chimeDestinationRef.current = masterGain;

    // Start Stochastic Chime Player
    startChimesLoop(ctx, masterGain);
  }, [masterVol, windVol]);

  // Play random chime strike
  const triggerChime = useCallback((ctx, destination, volLevel) => {
    if (!ctx || ctx.state === 'suspended' || volLevel <= 0.01) return;

    const frequencies = [329.63, 369.99, 415.30, 493.88, 554.37, 659.25]; // E4, F#4, G#4, B4, C#5, E5
    const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

    const now = ctx.currentTime;
    const decayDuration = Math.random() * 2 + 4; // 4 to 6 seconds resonance

    // Chime gain node
    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.05 * volLevel, now + 0.02); // quick strike
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

    // Pan Chime in Stereo Space
    let outNode = chimeGain;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.random() * 1.6 - 0.8; // -0.8 (left) to +0.8 (right)
      chimeGain.connect(panner);
      outNode = panner;
    }
    outNode.connect(destination);

    // Layer sine partials for inharmonic metal bell timbre
    const partials = [1.0, 2.004, 3.01, 4.25, 5.42];
    const amplitudes = [1.0, 0.45, 0.25, 0.15, 0.08];
    const oscNodes = [];

    partials.forEach((multiplier, index) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq * multiplier;

      const pGain = ctx.createGain();
      pGain.gain.value = amplitudes[index];

      osc.connect(pGain);
      pGain.connect(chimeGain);
      osc.start(now);
      osc.stop(now + decayDuration + 0.5);
      oscNodes.push(osc);
    });
  }, []);

  const startChimesLoop = useCallback((ctx, destination) => {
    if (chimesTimerRef.current) clearTimeout(chimesTimerRef.current);

    const scheduleNext = () => {
      const nextTime = Math.random() * 4000 + 3500; // strike every 3.5s to 7.5s
      chimesTimerRef.current = setTimeout(() => {
        triggerChime(ctx, destination, chimeVol);
        scheduleNext();
      }, nextTime);
    };

    scheduleNext();
  }, [chimeVol, triggerChime]);

  // Adjust volumes dynamically
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(masterVol, audioCtxRef.current.currentTime);
    }
  }, [masterVol]);

  useEffect(() => {
    if (windGainRef.current) {
      windGainRef.current.gain.setValueAtTime(windVol, audioCtxRef.current.currentTime);
    }
  }, [windVol]);

  // Play / Pause Logic
  const handleTogglePlay = useCallback(() => {
    if (!isPlaying) {
      initAudio();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  }, [isPlaying, initAudio]);

  // Body Class Toggles for reading mode
  useEffect(() => {
    if (isReadingMode) {
      document.body.classList.add('zen-mode-active');
    } else {
      document.body.classList.remove('zen-mode-active');
    }
    return () => {
      document.body.classList.remove('zen-mode-active');
    };
  }, [isReadingMode]);

  // Slideshow intervals for Focus Mode
  useEffect(() => {
    if (!isFocusMode) return;
    
    const imageInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FOCUS_IMAGES.length);
    }, 9000); // cycle image every 9s

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % PEACEFUL_QUOTES.length);
    }, 12000); // cycle quote every 12s

    return () => {
      clearInterval(imageInterval);
      clearInterval(quoteInterval);
    };
  }, [isFocusMode]);

  // Custom Cursor rendering in Reading Mode
  useEffect(() => {
    if (!isReadingMode) return;

    const cursor = document.createElement('div');
    cursor.className = 'zen-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let ballX = 0;
    let ballY = 0;
    const speed = 0.08; // slow follow speed

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      const distX = mouseX - ballX;
      const distY = mouseY - ballY;
      ballX += distX * speed;
      ballY += distY * speed;
      cursor.style.left = `${ballX}px`;
      cursor.style.top = `${ballY}px`;
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, [isReadingMode]);

  // Toggle Focus Mode
  const handleToggleFocus = useCallback(() => {
    setIsFocusMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.style.overflow = 'hidden';
        // Auto-play sound if not playing yet
        if (!isPlaying) {
          handleTogglePlay();
        }
      } else {
        document.body.style.overflow = '';
      }
      return next;
    });
  }, [isPlaying, handleTogglePlay]);

  return (
    <>
      {/* Floating Zen Toggle Trigger */}
      <button
        className={`zen-trigger${isPlaying ? ' zen-trigger--playing' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Silence the noise and toggle calm mode"
      >
        <svg className="zen-trigger__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isPlaying ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M17 8l-5-5-5 5M17 16l-5 5-5-5" />
          )}
        </svg>
        <span className="zen-trigger__text">{isPlaying ? 'Calm Mode On' : 'Silence the Noise'}</span>
      </button>

      {/* Control Panel Panel */}
      <div className={`zen-panel${isOpen ? ' zen-panel--open' : ''}`}>
        <div className="zen-panel__header">
          <div>
            <h3>Zen Sanctuary</h3>
            <p>Procedural Himalayan soundscapes & visual calm</p>
          </div>
          <button className="zen-panel__close" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="zen-panel__body">
          {/* Main Play/Pause Button */}
          <button 
            className={`zen-panel__play-btn${isPlaying ? ' zen-panel__play-btn--active' : ''}`}
            onClick={handleTogglePlay}
          >
            {isPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound'}
          </button>

          {/* Volume Control Sliders */}
          <div className="zen-panel__mixer">
            <div className="zen-panel__slider-group">
              <label>
                <span>Master Volume</span>
                <span>{Math.round(masterVol * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVol}
                onChange={(e) => setMasterVol(parseFloat(e.target.value))}
                disabled={!isPlaying}
              />
            </div>

            <div className="zen-panel__slider-group">
              <label>
                <span>🏔️ Himalayan Wind</span>
                <span>{Math.round(windVol * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={windVol}
                onChange={(e) => setWindVol(parseFloat(e.target.value))}
                disabled={!isPlaying}
              />
            </div>

            <div className="zen-panel__slider-group">
              <label>
                <span>🔔 Temple Chimes</span>
                <span>{Math.round(chimeVol * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={chimeVol}
                onChange={(e) => setChimeVol(parseFloat(e.target.value))}
                disabled={!isPlaying}
              />
            </div>
          </div>

          {/* Additional Zen Mode Toggles */}
          <div className="zen-panel__toggles">
            <button 
              className={`zen-panel__toggle-btn${isReadingMode ? ' active' : ''}`}
              onClick={() => setIsReadingMode((prev) => !prev)}
            >
              <span className="dot"></span>
              Quiet Reading Theme
            </button>

            <button 
              className={`zen-panel__toggle-btn${isFocusMode ? ' active' : ''}`}
              onClick={handleToggleFocus}
            >
              <span className="dot"></span>
              Full Focus Slideshow
            </button>
          </div>
        </div>
      </div>

      {/* Focus Mode Screen Overlay */}
      {isFocusMode && (
        <div className="focus-overlay">
          {/* Background Scenic Slideshow */}
          {FOCUS_IMAGES.map((src, index) => (
            <div 
              key={src}
              className={`focus-overlay__slide${currentSlide === index ? ' active' : ''}`}
            >
              <Image
                src={src}
                alt="Scenic Himalayan View at Shama Brews and Base"
                fill
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}

          {/* Dark overlay for contrast */}
          <div className="focus-overlay__shade" />

          {/* Central Quote Container */}
          <div className="focus-overlay__content">
            <div className="focus-overlay__quote-box">
              <p className="focus-overlay__quote-text">
                &ldquo;{PEACEFUL_QUOTES[currentQuote].text}&rdquo;
              </p>
              <span className="focus-overlay__quote-author">
                — {PEACEFUL_QUOTES[currentQuote].author}
              </span>
            </div>
          </div>

          {/* Control bar in Focus Mode */}
          <div className="focus-overlay__controls">
            <button className="focus-overlay__btn" onClick={handleTogglePlay}>
              {isPlaying ? '🔊 Mute Sound' : '🔇 Play Sound'}
            </button>
            <button className="focus-overlay__btn" onClick={handleToggleFocus}>
              ✕ Return to Site
            </button>
          </div>
        </div>
      )}
    </>
  );
}
