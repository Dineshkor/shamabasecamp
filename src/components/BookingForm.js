'use client';

import { useState, useEffect, useRef } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    checkin: '',
    checkout: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('now');
  const [transactionId, setTransactionId] = useState('');

  const sectionRef = useRef(null);

  // Format check-in/check-out dates for better readability
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (err) {
      return dateStr;
    }
  };

  const getNights = () => {
    if (!formData.checkin || !formData.checkout) return 0;
    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const getGuestsNum = () => {
    const g = formData.guests;
    const val = parseInt(g);
    if (isNaN(val)) return 6;
    return val;
  };

  const totalAmount = getGuestsNum() * getNights() * 3000;

  // Get today's date in YYYY-MM-DD local format
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Get minimum check-out date in YYYY-MM-DD local format
  const getMinCheckoutString = () => {
    if (!formData.checkin) {
      return getTodayString();
    }
    const checkinDate = new Date(formData.checkin);
    const nextDay = new Date(checkinDate);
    nextDay.setDate(checkinDate.getDate() + 1);
    
    const yyyy = nextDay.getFullYear();
    const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDay.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Intersection Observer for reveal animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealElements = section.querySelectorAll('.reveal');

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

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      
      // If check-in date changed, validate and adjust check-out if needed
      if (name === 'checkin' && value) {
        const checkinDate = new Date(value);
        if (prev.checkout) {
          const checkoutDate = new Date(prev.checkout);
          if (checkoutDate <= checkinDate) {
            // Automatically set checkout to check-in + 1 day
            const nextDay = new Date(checkinDate);
            nextDay.setDate(checkinDate.getDate() + 1);
            const yyyy = nextDay.getFullYear();
            const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
            const dd = String(nextDay.getDate()).padStart(2, '0');
            next.checkout = `${yyyy}-${mm}-${dd}`;
          }
        }
      }
      return next;
    });

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      // Check-in date required and must be today or in the future
      if (!formData.checkin) {
        newErrors.checkin = 'Check-in date is required';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkinDate = new Date(formData.checkin);
        checkinDate.setHours(0, 0, 0, 0);
        if (checkinDate < today) {
          newErrors.checkin = 'Check-in date cannot be in the past';
        }
      }

      // Check-out date required and must be after check-in
      if (!formData.checkout) {
        newErrors.checkout = 'Check-out date is required';
      } else if (formData.checkin && formData.checkout) {
        const checkinDate = new Date(formData.checkin);
        const checkoutDate = new Date(formData.checkout);
        checkinDate.setHours(0, 0, 0, 0);
        checkoutDate.setHours(0, 0, 0, 0);
        if (checkoutDate <= checkinDate) {
          newErrors.checkout = 'Check-out date must be after check-in';
        }
      }

      // Guest validation if in 6+ mode
      if (!['1', '2', '3', '4', '5'].includes(formData.guests)) {
        const guestsVal = parseInt(formData.guests);
        if (!formData.guests || isNaN(guestsVal) || guestsVal < 6) {
          newErrors.guests = 'Please specify at least 6 guests';
        }
      }
    } else if (stepNum === 2) {
      // Name required
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      // Email is optional, but if filled, validate format
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Phone required
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2)) {
      if (!validateStep(1)) setStep(1);
      else setStep(2);
      return;
    }

    setLoading(true);

    const nights = getNights();
    const guests = getGuestsNum();

    const messageText = `*Booking Enquiry & Payment - Shama Basecamp*

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}
*Guests:* ${formData.guests} (${guests} calculated)
*Check-in:* ${formatDate(formData.checkin)}
*Check-out:* ${formatDate(formData.checkout)}
*Nights:* ${nights}
*Total Amount:* ₹${totalAmount.toLocaleString('en-IN')} (₹3,000/person/night)

*Payment Status:* ${paymentMethod === 'now' ? 'Paid via UPI QR Scanner' : 'Pay Later / Coordination'}
${paymentMethod === 'now' && transactionId.trim() ? `*UPI Transaction ID:* ${transactionId.trim()}` : ''}

*Interests Selected:*
${selectedInterests.length > 0 ? selectedInterests.join(', ') : 'None'}

*Message / Special Requests:*
${formData.message || 'None'}`;

    const whatsappUrl = `https://wa.me/919411727231?text=${encodeURIComponent(messageText)}`;
    
    setWhatsappLink(whatsappUrl);
    setLoading(false);
    setSubmitted(true);

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="booking" className="section section-alt" ref={sectionRef}>
      <div className="section-inner">
        <div className="booking__grid">
          {/* LEFT — Info Column */}
          <div className="booking__info reveal">
            <h2>Plan Your Stay</h2>
            <div className="section-divider" style={{ margin: 'var(--space-md) 0' }} />

            <p>
              Ready to leave the noise behind? Fill in your details and we&apos;ll
              get back to you within 24 hours to help plan your mountain escape.
            </p>
            <p>
              We keep our groups small to preserve the peace of the village. Each
              stay includes home-cooked meals, guided walks, and all the mountain
              air you can breathe.
            </p>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <div className="booking__contact-item">
                <span className="booking__contact-icon">📧</span>
                <a href="mailto:shamabasecamp@gmail.com" className="booking__contact-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                  shamabasecamp@gmail.com
                </a>
              </div>
              <div className="booking__contact-item">
                <span className="booking__contact-icon">📞</span>
                <a href="tel:+919411727231" className="booking__contact-link" style={{ color: 'inherit', textDecoration: 'none' }}>
                  +91 94117 27231
                </a>
              </div>
              <div className="booking__contact-item">
                <span className="booking__contact-icon">📍</span>
                <span>Shama Village, Bageshwar, Uttarakhand</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Form Column */}
          <div className="booking__form reveal reveal-delay-2">
            {submitted ? (
              <div className="form__success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="form__success-icon">💬</div>
                <h3>Booking enquiry generated!</h3>
                <p style={{ marginBottom: 'var(--space-md)' }}>
                  We are opening WhatsApp so you can send your booking enquiry directly. If it didn&apos;t open automatically, please click the button below to send it.
                </p>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="form__submit"
                  style={{ 
                    display: 'inline-block', 
                    textAlign: 'center', 
                    textDecoration: 'none',
                    lineHeight: '1.5'
                  }}
                >
                  Send Enquiry via WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Progress Indicator */}
                <div className="form__steps-indicator">
                  <div 
                    className={`step-dot${step >= 1 ? ' active' : ''}`} 
                    onClick={() => step > 1 && setStep(1)} 
                    style={{ cursor: step > 1 ? 'pointer' : 'default' }}
                  >
                    <span>1</span> Stay
                  </div>
                  <div className="step-line" />
                  <div 
                    className={`step-dot${step >= 2 ? ' active' : ''}`} 
                    onClick={() => step > 2 && setStep(2)} 
                    style={{ cursor: step > 2 ? 'pointer' : 'default' }}
                  >
                    <span>2</span> Details
                  </div>
                  <div className="step-line" />
                  <div 
                    className={`step-dot${step >= 3 ? ' active' : ''}`}
                    onClick={() => step > 3 && setStep(3)} 
                    style={{ cursor: step > 3 ? 'pointer' : 'default' }}
                  >
                    <span>3</span> Notes
                  </div>
                  <div className="step-line" />
                  <div className={`step-dot${step >= 4 ? ' active' : ''}`}>
                    <span>4</span> Pay
                  </div>
                </div>

                {/* STEP 1: Stay Dates & Guests */}
                {step === 1 && (
                  <div className="animate-in">
                    <div className="form__row">
                      <div className="form__group">
                        <label className="form__label" htmlFor="booking-checkin">
                          Check-in Date *
                        </label>
                        <input
                          className="form__input"
                          type="date"
                          id="booking-checkin"
                          name="checkin"
                          value={formData.checkin}
                          onChange={handleChange}
                          min={getTodayString()}
                        />
                        {errors.checkin && (
                          <div className="form__error">{errors.checkin}</div>
                        )}
                      </div>
                      <div className="form__group">
                        <label className="form__label" htmlFor="booking-checkout">
                          Check-out Date *
                        </label>
                        <input
                          className="form__input"
                          type="date"
                          id="booking-checkout"
                          name="checkout"
                          value={formData.checkout}
                          onChange={handleChange}
                          min={getMinCheckoutString()}
                        />
                        {errors.checkout && (
                          <div className="form__error">{errors.checkout}</div>
                        )}
                      </div>
                    </div>

                    <div className="form__group" style={{ marginBottom: 'var(--space-lg)' }}>
                      <label className="form__label">
                        Number of Guests
                      </label>
                      <div className="guest-pills">
                        {['1', '2', '3', '4', '5', '6+'].map((opt) => {
                          const isCustom = opt === '6+';
                          const isActive = isCustom
                            ? !['1', '2', '3', '4', '5'].includes(formData.guests)
                            : formData.guests === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={`guest-pill${isActive ? ' guest-pill--active' : ''}`}
                              onClick={() => {
                                if (isCustom) {
                                  const currentGuests = parseInt(formData.guests) || 0;
                                  if (currentGuests < 6) {
                                    setFormData((prev) => ({ ...prev, guests: '6' }));
                                  }
                                } else {
                                  setFormData((prev) => ({ ...prev, guests: opt }));
                                }
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {!['1', '2', '3', '4', '5'].includes(formData.guests) && (
                      <div className="animate-in form__group" style={{ marginTop: 'var(--space-md)' }}>
                        <label className="form__label" htmlFor="custom-guests">
                          Specify Number of Guests (6 or more)
                        </label>
                        <input
                          className="form__input"
                          type="number"
                          id="custom-guests"
                          name="guests"
                          min="6"
                          value={formData.guests}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({ ...prev, guests: val }));
                            if (errors.guests) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next.guests;
                                return next;
                              });
                            }
                          }}
                        />
                        {errors.guests && (
                          <div className="form__error">{errors.guests}</div>
                        )}
                      </div>
                    )}

                    {formData.checkin && formData.checkout && getNights() > 0 && (
                      <div className="price-preview animate-in">
                        <span className="price-preview__label">Estimated Stay Cost:</span>
                        <span className="price-preview__val">
                          ₹{(getGuestsNum() * getNights() * 3000).toLocaleString('en-IN')} 
                          <span className="price-preview__sub"> ({getGuestsNum()} guest{getGuestsNum() > 1 ? 's' : ''} × {getNights()} night{getNights() > 1 ? 's' : ''})</span>
                        </span>
                      </div>
                    )}

                    <div className="form__navigation">
                      <div />
                      <button
                        type="button"
                        className="form__submit"
                        style={{ width: 'auto' }}
                        onClick={handleNextStep}
                      >
                        Next: Contact Details ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Contact Details */}
                {step === 2 && (
                  <div className="animate-in">
                    <div className="form__group">
                      <label className="form__label" htmlFor="booking-name">
                        Name *
                      </label>
                      <input
                        className="form__input"
                        type="text"
                        id="booking-name"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="form__error">{errors.name}</div>
                      )}
                    </div>

                    <div className="form__row">
                      <div className="form__group">
                        <label className="form__label" htmlFor="booking-email">
                          Email
                        </label>
                        <input
                          className="form__input"
                          type="email"
                          id="booking-email"
                          name="email"
                          placeholder="you@example.com (optional)"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="form__error">{errors.email}</div>
                        )}
                      </div>
                      <div className="form__group">
                        <label className="form__label" htmlFor="booking-phone">
                          Phone *
                        </label>
                        <input
                          className="form__input"
                          type="tel"
                          id="booking-phone"
                          name="phone"
                          placeholder="e.g. +91 94117 27231"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <div className="form__error">{errors.phone}</div>
                        )}
                      </div>
                    </div>

                    <div className="form__navigation">
                      <button
                        type="button"
                        className="form__btn-back"
                        onClick={handlePrevStep}
                      >
                        ⬅ Back
                      </button>
                      <button
                        type="button"
                        className="form__submit"
                        style={{ width: 'auto' }}
                        onClick={handleNextStep}
                      >
                        Next: Preferences ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Experience Preferences & Message */}
                {step === 3 && (
                  <div className="animate-in">
                    <div className="form__group">
                      <label className="form__label">
                        Interests (Optional)
                      </label>
                      <div className="interest-pills">
                        {[
                          'Himalayan Treks 🥾',
                          'Sunrise Views 🌄',
                          'Birdwatching 🐦',
                          'Village Cooking 🍲',
                          'Stargazing ✨',
                          'Village Walks 🏘️',
                        ].map((interest) => {
                          const isActive = selectedInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              className={`interest-pill${isActive ? ' interest-pill--active' : ''}`}
                              onClick={() => toggleInterest(interest)}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form__group">
                      <label className="form__label" htmlFor="booking-message">
                        Message / Special Requests
                      </label>
                      <textarea
                        className="form__textarea"
                        id="booking-message"
                        name="message"
                        placeholder="Tell us about any dietary preferences or anything else we should know…"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form__navigation">
                      <button
                        type="button"
                        className="form__btn-back"
                        onClick={handlePrevStep}
                      >
                        ⬅ Back
                      </button>
                      <button
                        type="button"
                        className="form__submit"
                        style={{ width: 'auto' }}
                        onClick={handleNextStep}
                      >
                        Next: Payment ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Payment Selection and Details */}
                {step === 4 && (
                  <div className="animate-in">
                    {/* Stay details box */}
                    <div className="payment__summary-box">
                      <div className="payment__summary-title">Booking Summary</div>
                      <div className="payment__summary-row">
                        <span>Check-in:</span>
                        <strong>{formatDate(formData.checkin)}</strong>
                      </div>
                      <div className="payment__summary-row">
                        <span>Check-out:</span>
                        <strong>{formatDate(formData.checkout)}</strong>
                      </div>
                      <div className="payment__summary-row">
                        <span>Guests:</span>
                        <strong>{formData.guests}</strong>
                      </div>
                      <div className="payment__summary-row">
                        <span>Duration:</span>
                        <strong>{getNights()} {getNights() === 1 ? 'night' : 'nights'}</strong>
                      </div>
                      <div className="payment__summary-divider" />
                      <div className="payment__summary-total">
                        <span>Total Stay Price:</span>
                        <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="payment__summary-subtext">
                        calculated at ₹3,000 per person per night
                      </div>
                    </div>

                    <div className="form__group" style={{ marginTop: 'var(--space-md)' }}>
                      <label className="form__label">Choose Payment Option</label>
                      <div className="payment__selector">
                        <button
                          key="now"
                          type="button"
                          className={`payment__option-card${paymentMethod === 'now' ? ' payment__option-card--active' : ''}`}
                          onClick={() => setPaymentMethod('now')}
                        >
                          <div className="payment__option-icon">📱</div>
                          <div className="payment__option-title">Pay Now</div>
                          <div className="payment__option-desc">Scan UPI QR Code to secure booking</div>
                        </button>
                        <button
                          key="later"
                          type="button"
                          className={`payment__option-card${paymentMethod === 'later' ? ' payment__option-card--active' : ''}`}
                          onClick={() => setPaymentMethod('later')}
                        >
                          <div className="payment__option-icon">⏳</div>
                          <div className="payment__option-title">Pay Later</div>
                          <div className="payment__option-desc">Submit request and arrange pay later</div>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'now' ? (
                      <div className="animate-in payment__qr-section">
                        <p style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)', color: 'var(--stone-light)' }}>
                          Please scan the UPI QR code below with any UPI payment app (Google Pay, PhonePe, Paytm) to complete your transaction of <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.
                        </p>
                        
                        <div className="payment__qr-wrapper">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src="/images/payment_qr.jpg" 
                            alt="UPI Payment QR Code" 
                            className="payment__qr-image"
                          />
                        </div>

                        <div className="form__group" style={{ marginTop: 'var(--space-md)' }}>
                          <label className="form__label" htmlFor="booking-txid">
                            UPI Transaction / Reference ID (Optional)
                          </label>
                          <input
                            className="form__input"
                            type="text"
                            id="booking-txid"
                            placeholder="e.g. 614298374921"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                          <span className="payment__txid-help">
                            Enter the 12-digit transaction/UTR number to help us verify your payment.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in payment__later-section">
                        <div className="payment__later-box">
                          <p>
                            Your booking request will be submitted, and the host will contact you to coordinate dates and arrange manual payment.
                          </p>
                          <p style={{ marginTop: '8px', fontSize: '0.95rem', color: 'var(--stone-light)' }}>
                            No immediate charge will be made.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="form__navigation">
                      <button
                        type="button"
                        className="form__btn-back"
                        onClick={handlePrevStep}
                      >
                        ⬅ Back
                      </button>
                      <button
                        type="submit"
                        className={`form__submit${loading ? ' form__submit--loading' : ''}`}
                        style={{ width: 'auto' }}
                        disabled={loading}
                      >
                        {loading ? 'Sending…' : 'Complete Booking on WhatsApp 💬'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
