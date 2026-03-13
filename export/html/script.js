/* ═══════════════════════════════════════════════════════════
   TOOTHCARE — Interactions & Animations
   Scroll reveals, counter, carousel, before/after slider,
   booking modal, sticky header, mobile nav, reduced-motion
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Reduced Motion Check ─── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Sticky Header ─── */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('site-header--scrolled', y > 80);
      lastScroll = y;
    }, { passive: true });
  }

  /* ─── Mobile Nav ─── */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      primaryNav.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        menuToggle.click();
        menuToggle.focus();
      }
    });

    // Close on link click
    primaryNav.querySelectorAll('.site-header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          menuToggle.click();
        }
      });
    });
  }

  /* ─── Scroll Reveal ─── */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }
  initReveal();

  /* ─── Counter Animation ─── */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();

      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }
  initCounters();

  /* ─── Brush Stroke Parallax ─── */
  function initParallax() {
    if (prefersReducedMotion) return;

    const brushes = document.querySelectorAll('.hero__brush, .why__brush, .cta-strip__brush');
    if (!brushes.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          brushes.forEach(brush => {
            const rect = brush.getBoundingClientRect();
            const offset = (rect.top / window.innerHeight - 0.5) * 16;
            brush.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  initParallax();

  /* ─── Testimonial Carousel ─── */
  function initCarousel() {
    const track = document.querySelector('.testimonial-carousel__track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-carousel__dot');
    const prevBtn = document.querySelector('.testimonial-carousel__btn--prev');
    const nextBtn = document.querySelector('.testimonial-carousel__btn--next');
    const liveRegion = document.querySelector('.testimonial-carousel__live');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = 1;

    function updateSlidesPerView() {
      if (window.innerWidth >= 1024) slidesPerView = 3;
      else if (window.innerWidth >= 768) slidesPerView = 2;
      else slidesPerView = 1;
    }

    function goTo(index) {
      const maxIndex = Math.max(0, slides.length - slidesPerView);
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const offset = -(currentIndex * (100 / slidesPerView));
      track.style.transform = `translateX(${offset}%)`;

      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', i < currentIndex || i >= currentIndex + slidesPerView ? 'true' : 'false');
      });

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
        d.setAttribute('aria-selected', i === currentIndex);
      });

      if (liveRegion) {
        liveRegion.textContent = `Showing testimonial ${currentIndex + 1} of ${slides.length}`;
      }
    }

    updateSlidesPerView();
    goTo(0);

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    window.addEventListener('resize', () => {
      updateSlidesPerView();
      goTo(currentIndex);
    });

    // Auto-play (pause on hover/focus)
    let autoplayInterval;
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    startAutoplay();
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', startAutoplay);
    }
  }
  initCarousel();

  /* ─── Before/After Slider ─── */
  function initBeforeAfter() {
    document.querySelectorAll('.before-after__slider').forEach(slider => {
      const handle = slider.querySelector('.before-after__handle');
      const afterWrap = slider.querySelector('.before-after__after-wrap');
      if (!handle || !afterWrap) return;

      let isDragging = false;

      function updatePosition(x) {
        const rect = slider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        afterWrap.style.width = `${percent}%`;
        handle.style.left = `${percent}%`;
        handle.setAttribute('aria-valuenow', Math.round(percent));
      }

      // Mouse
      handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) updatePosition(e.clientX);
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch
      handle.addEventListener('touchstart', (e) => {
        isDragging = true;
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length) {
          updatePosition(e.touches[0].clientX);
        }
      }, { passive: true });

      document.addEventListener('touchend', () => {
        isDragging = false;
      });

      // Click on slider body
      slider.addEventListener('click', (e) => {
        if (e.target !== handle) updatePosition(e.clientX);
      });

      // Keyboard
      handle.addEventListener('keydown', (e) => {
        const currentVal = parseInt(handle.getAttribute('aria-valuenow'), 10);
        let newVal = currentVal;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          newVal = Math.max(0, currentVal - 5);
          e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          newVal = Math.min(100, currentVal + 5);
          e.preventDefault();
        } else if (e.key === 'Home') {
          newVal = 0;
          e.preventDefault();
        } else if (e.key === 'End') {
          newVal = 100;
          e.preventDefault();
        }

        if (newVal !== currentVal) {
          afterWrap.style.width = `${newVal}%`;
          handle.style.left = `${newVal}%`;
          handle.setAttribute('aria-valuenow', newVal);
        }
      });
    });
  }
  initBeforeAfter();

  /* ─── Overlapping Doctor Carousel ─── */
  function initDoctorCarousel() {
    const track = document.getElementById('doctors-track');
    const prevBtn = document.getElementById('doc-prev');
    const nextBtn = document.getElementById('doc-next');
    const cards = document.querySelectorAll('.doctor-card');
    if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentIndex = 0;
    
    function getCardStackWidth() {
      const card = cards[0];
      const style = window.getComputedStyle(card);
      const width = card.offsetWidth;
      const margin = parseFloat(style.marginRight); // negative overlap
      return width + margin;
    }

    function updateCarousel() {
      if (prefersReducedMotion) {
         track.style.transform = `translateX(0)`;
         track.style.overflowX = 'auto';
         return;
      }
      const moveAmount = getCardStackWidth();
      track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
      
      prevBtn.disabled = currentIndex === 0;
      // Allow scrolling until the last card is fully visible
      const maxVisible = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
      nextBtn.disabled = currentIndex >= Math.max(0, cards.length - maxVisible);

      cards.forEach((card, idx) => {
        if (idx === currentIndex) {
           card.classList.add('is-active');
        } else {
           card.classList.remove('is-active');
        }
      });
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const maxVisible = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
      if (currentIndex < Math.max(0, cards.length - maxVisible)) {
        currentIndex++;
        updateCarousel();
      }
    });

    cards.forEach((card, idx) => {
       card.addEventListener('click', (e) => {
         if(e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
         currentIndex = idx;
         updateCarousel();
       });
    });

    window.addEventListener('resize', updateCarousel);
    setTimeout(updateCarousel, 100);
  }
  initDoctorCarousel();

  /* ─── Tips Interactive Modal ─── */
  function initTipsModal() {
    const modal = document.getElementById('tips-modal');
    if (!modal) return;
    
    const titleEl = document.getElementById('tips-modal-title');
    const metaEl = document.getElementById('tips-modal-meta');
    const bodyEl = document.getElementById('tips-modal-body');
    const cards = document.querySelectorAll('.tips__card');
    const closeBtns = modal.querySelectorAll('[data-close]');
    
    let lastFocusedElement = null;

    function openModal(title, meta, paragraph) {
      titleEl.textContent = title;
      metaEl.textContent = meta;
      bodyEl.innerHTML = `<p>${paragraph}</p>`;
      
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      // Focus management
      lastFocusedElement = document.activeElement;
      setTimeout(() => {
        const closeBtn = modal.querySelector('.tips-modal__close');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault(); // Stop normal link navigation
        
        const title = card.querySelector('h3').textContent;
        // Find the text like "4 min read" by splitting the meta string
        const metaText = card.querySelector('.tips__meta').textContent;
        const readTimeMatch = metaText.match(/\d+\s*min read/i);
        const meta = readTimeMatch ? readTimeMatch[0] : 'Quick read';
        
        const excerpt = card.querySelector('.tips__excerpt').textContent;
        // In a real app, you would fetch full content here. We'll use excerpt + placeholder.
        const fullText = `${excerpt} <br><br> Maintaining your dental health doesn't have to be complicated. By making this small adjustment to your routine, you can significantly improve your long-term clinical outcomes while keeping your smile bright and healthy.`;
        
        openModal(title, meta, fullText);
      });
      
      // Accessibility: allow opening via Enter key
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }
  initTipsModal();

  /* ─── Booking Modal ─── */
  function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');
    if (!modal || !form) return;

    const triggers = document.querySelectorAll('.book-trigger, [href="#booking"]');
    const closeBtn = modal.querySelector('.booking-modal__close');
    const backdrop = modal.querySelector('.booking-modal__backdrop');
    const panels = modal.querySelectorAll('.booking-modal__panel');
    const steps = modal.querySelectorAll('.booking-step');
    const prevBtn = document.getElementById('booking-prev');
    const nextBtn = document.getElementById('booking-next');
    const submitBtn = document.getElementById('booking-submit');
    const summaryEl = document.getElementById('booking-summary');
    const successEl = document.getElementById('booking-success');

    let currentStep = 1;
    let triggerElement = null;

    // Focus trap
    function getFocusableElements() {
      return modal.querySelectorAll(
        'button:not([hidden]):not([disabled]), [href], input:not([hidden]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex]:not([tabindex="-1"]):not([hidden])'
      );
    }

    function trapFocus(e) {
      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openModal(doctor) {
      modal.hidden = false;
      requestAnimationFrame(() => {
        modal.classList.add('is-open');
      });
      document.body.style.overflow = 'hidden';
      modal.addEventListener('keydown', trapFocus);
      closeBtn.focus();

      // Pre-select doctor if clicked from doctor card
      if (doctor) {
        const providerSelect = document.getElementById('booking-provider');
        if (providerSelect) {
          for (let opt of providerSelect.options) {
            if (opt.value.toLowerCase().includes(doctor.replace('dr-', 'Dr. ').replace(/-/g, ' '))) {
              opt.selected = true;
              break;
            }
          }
        }
      }

      // Set minimum date to tomorrow
      const dateInput = document.getElementById('booking-date');
      if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
      }

      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'book_open', { event_category: 'booking' });
      }
    }

    function closeModal() {
      modal.classList.remove('is-open');
      setTimeout(() => {
        modal.hidden = true;
        document.body.style.overflow = '';
        modal.removeEventListener('keydown', trapFocus);
        if (triggerElement) {
          triggerElement.focus();
          triggerElement = null;
        }
        resetForm();
      }, 320);
    }

    function resetForm() {
      form.reset();
      currentStep = 1;
      showStep(1);
      if (successEl) successEl.hidden = true;
      if (summaryEl) summaryEl.innerHTML = '';
    }

    function showStep(step) {
      currentStep = step;
      panels.forEach(p => {
        p.setAttribute('aria-hidden', parseInt(p.dataset.panel) !== step);
      });
      steps.forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (sNum === step) s.classList.add('active');
        else if (sNum < step) s.classList.add('completed');
      });

      if (prevBtn) prevBtn.hidden = step === 1;
      if (nextBtn) nextBtn.hidden = step === 5;
      if (submitBtn) submitBtn.hidden = step !== 5;

      // Build summary on step 5
      if (step === 5 && summaryEl) {
        const service = document.getElementById('booking-service')?.value || '—';
        const provider = document.getElementById('booking-provider')?.value || 'No preference';
        const date = document.getElementById('booking-date')?.value || '—';
        const time = document.getElementById('booking-time')?.value || '—';
        const name = document.getElementById('booking-name')?.value || '—';
        const email = document.getElementById('booking-email')?.value || '—';
        const code = document.getElementById('booking-country-code')?.value || '';
        const phone = document.getElementById('booking-phone')?.value || '';

        summaryEl.innerHTML = `
          <p><strong>Service</strong><span>${service}</span></p>
          <p><strong>Provider</strong><span>${provider}</span></p>
          <p><strong>Date</strong><span>${date}</span></p>
          <p><strong>Time</strong><span>${time}</span></p>
          <p><strong>Name</strong><span>${name}</span></p>
          <p><strong>Email</strong><span>${email}</span></p>
          <p><strong>Phone</strong><span>${code} ${phone}</span></p>
        `;
      }
    }

    function validateStep(step) {
      let valid = true;

      if (step === 1) {
        const service = document.getElementById('booking-service');
        if (!service.value) {
          service.classList.add('is-invalid');
          valid = false;
        } else {
          service.classList.remove('is-invalid');
        }
      }

      if (step === 3) {
        const date = document.getElementById('booking-date');
        const time = document.getElementById('booking-time');

        if (!date.value) {
          date.classList.add('is-invalid');
          valid = false;
        } else {
          date.classList.remove('is-invalid');
        }

        if (!time.value) {
          time.classList.add('is-invalid');
          valid = false;
        } else {
          time.classList.remove('is-invalid');
        }
      }

      if (step === 4) {
        const name = document.getElementById('booking-name');
        const email = document.getElementById('booking-email');
        const phone = document.getElementById('booking-phone');

        // Name: min 2 chars
        if (!name.value || name.value.trim().length < 2) {
          name.classList.add('is-invalid');
          valid = false;
        } else {
          name.classList.remove('is-invalid');
        }

        // Email: RFC5322 pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailRegex.test(email.value)) {
          email.classList.add('is-invalid');
          valid = false;
        } else {
          email.classList.remove('is-invalid');
        }

        // Phone: required
        if (!phone.value || phone.value.trim().length < 5) {
          phone.classList.add('is-invalid');
          valid = false;
        } else {
          phone.classList.remove('is-invalid');
        }
      }

      return valid;
    }

    // Event listeners
    triggers.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        triggerElement = t;
        const doctor = t.dataset.doctor || null;
        openModal(doctor);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          showStep(currentStep + 1);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showStep(currentStep - 1);
      });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const code = document.getElementById('booking-country-code')?.value || '+91';
      const phone = document.getElementById('booking-phone')?.value || '';
      // E.164 normalization
      const phoneE164 = code + phone.replace(/\D/g, '');

      const payload = {
        clinic: '{{CLINIC_NAME}}',
        service: document.getElementById('booking-service')?.value,
        provider: document.getElementById('booking-provider')?.value || null,
        datetime: `${document.getElementById('booking-date')?.value}T${document.getElementById('booking-time')?.value}:00`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        patient: {
          name: document.getElementById('booking-name')?.value,
          email: document.getElementById('booking-email')?.value,
          phone_e164: phoneE164,
          notes: document.getElementById('booking-notes')?.value || ''
        },
        source: 'website',
        utm: {
          source: new URLSearchParams(window.location.search).get('utm_source') || '',
          campaign: new URLSearchParams(window.location.search).get('utm_campaign') || ''
        }
      };

      console.log('Booking payload:', JSON.stringify(payload, null, 2));

      // Example webhook submission (replace {{WEBHOOK_URL}} with actual endpoint)
      /*
      fetch('{{WEBHOOK_URL}}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => { ... })
      .catch(err => { ... });
      */

      // Show success
      if (summaryEl) summaryEl.hidden = true;
      if (successEl) successEl.hidden = false;
      if (submitBtn) submitBtn.hidden = true;
      if (prevBtn) prevBtn.hidden = true;

      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'book_submit', {
          event_category: 'booking',
          service: payload.service
        });
      }
    });

    // Add to calendar
    const calBtn = document.getElementById('add-to-calendar');
    if (calBtn) {
      calBtn.addEventListener('click', () => {
        const service = document.getElementById('booking-service')?.value || 'Dental Appointment';
        const date = document.getElementById('booking-date')?.value || '';
        const time = document.getElementById('booking-time')?.value || '09:00';

        if (date) {
          const start = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
          const end = `${date.replace(/-/g, '')}T${(parseInt(time) + 1).toString().padStart(2, '0')}${time.slice(3)}00`;
          const gcalUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(service + ' — ToothCare')}&dates=${start}/${end}&details=${encodeURIComponent('Your dental appointment at ToothCare.')}`;
          window.open(gcalUrl, '_blank', 'noopener');

          if (typeof gtag === 'function') {
            gtag('event', 'add_to_calendar', { event_category: 'booking' });
          }
        }
      });
    }

    showStep(1);
  }
  initBookingModal();

  /* ─── Call Click GA4 Event ─── */
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'call_click', { event_category: 'engagement' });
      }
    });
  });

})();
