/* ============================================================
   TOOTHCARE — Interactions & UI Logic
   Version: 1.0.0
   ============================================================ */

(function () {
  'use strict';

  /* ── Refs ─────────────────────────────────────────────── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Init ─────────────────────────────────────────────── */
  function initUI() {
    handleScrollHeader();
    window.addEventListener('scroll', handleScrollHeader, { passive: true });

    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initBeforeAfter();
    initCarousel();
    initBookingModal();
    initBookingForm();
  }

  document.addEventListener('DOMContentLoaded', initUI);

  /* ── Header Scroll ────────────────────────────────────── */
  function handleScrollHeader() {
    const header = $('#site-header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ── Mobile Menu ──────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = $('#mobile-menu-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', toggleMobileMenu);

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') && e.target === document.body) {
        toggleMobileMenu();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        toggleMobileMenu();
        toggle.focus();
      }
    });

    // Close when clicking a nav link
    $$('.nav-list a').forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  function toggleMobileMenu() {
    const toggle = $('#mobile-menu-toggle');
    const isOpen = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  /* ── Smooth Scroll ────────────────────────────────────── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#' || id === '#booking') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      });
    });
  }

  /* ── Scroll Reveal ────────────────────────────────────── */
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      $$('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  }

  /* ── Animated Counters ────────────────────────────────── */
  function initCounters() {
    const counters = $$('.counter');
    if (!counters.length) return;

    if (prefersReducedMotion()) {
      counters.forEach(c => {
        c.textContent = c.dataset.target + (c.dataset.suffix || '');
      });
      return;
    }

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

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* ── Before/After Slider ──────────────────────────────── */
  function initBeforeAfter() {
    $$('.ba-slider').forEach(slider => {
      const handle = $('.ba-handle', slider);
      const afterWrap = $('.ba-after-wrapper', slider);
      if (!handle || !afterWrap) return;

      let isDragging = false;

      function setPosition(pct) {
        pct = Math.max(0, Math.min(100, pct));
        afterWrap.style.width = pct + '%';
        handle.style.left = pct + '%';
        handle.setAttribute('aria-valuenow', Math.round(pct));
      }

      function getPercent(clientX) {
        const rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      // Pointer events
      handle.addEventListener('pointerdown', (e) => {
        isDragging = true;
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
      });

      slider.addEventListener('pointerdown', (e) => {
        if (e.target === handle || handle.contains(e.target)) return;
        isDragging = true;
        setPosition(getPercent(e.clientX));
      });

      document.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        setPosition(getPercent(e.clientX));
      });

      document.addEventListener('pointerup', () => {
        isDragging = false;
      });

      // Keyboard
      handle.addEventListener('keydown', (e) => {
        const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          setPosition(current - 5);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          setPosition(current + 5);
        }
      });
    });
  }

  /* ── Testimonial Carousel ─────────────────────────────── */
  function initCarousel() {
    const track = $('.carousel-track');
    if (!track) return;

    const slides = $$('.testimonial-slide', track);
    const dotsContainer = $('.carousel-indicators');
    const prevBtn = $('.carousel-btn--prev');
    const nextBtn = $('.carousel-btn--next');
    const liveRegion = $('.carousel-live');
    let current = 0;
    let autoTimer = null;

    function goTo(index) {
      current = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;

      // Update indicators
      $$('.carousel-dot', dotsContainer).forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-selected', i === current);
      });

      // Update slides aria-hidden
      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', i !== current);
      });

      // Announce
      if (liveRegion) {
        liveRegion.textContent = `Showing testimonial ${current + 1} of ${slides.length}`;
      }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 6000);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }

    // Events
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    if (dotsContainer) {
      $$('.carousel-dot', dotsContainer).forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i); startAuto(); });
      });
    }

    // Pause on hover/focus
    const carouselEl = track.closest('.testimonials');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAuto);
      carouselEl.addEventListener('mouseleave', startAuto);
      carouselEl.addEventListener('focusin', stopAuto);
      carouselEl.addEventListener('focusout', startAuto);
    }

    goTo(0);
    if (!prefersReducedMotion()) startAuto();
  }

  /* ── Booking Modal ────────────────────────────────────── */
  let lastFocusedEl = null;

  function initBookingModal() {
    // Open triggers
    $$('[href="#booking"], .book-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prefill = {};
        if (btn.dataset.doctorId) prefill.doctor = btn.dataset.doctorId;
        if (btn.dataset.service) prefill.service = btn.dataset.service;
        openBookingModal(prefill);
      });
    });

    // Close triggers
    const overlay = $('#booking-modal');
    if (!overlay) return;

    $('.modal-close', overlay).addEventListener('click', closeBookingModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBookingModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeBookingModal();
      }
    });
  }

  function openBookingModal(prefill = {}) {
    const overlay = $('#booking-modal');
    if (!overlay) return;

    lastFocusedEl = document.activeElement;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Prefill
    if (prefill.service) {
      const svc = $('#fld-service', overlay);
      if (svc) svc.value = prefill.service;
    }
    if (prefill.doctor) {
      try { localStorage.setItem('toothcare_last_doc', prefill.doctor); } catch (e) { /* noop */ }
    }

    // Set min date
    const dateField = $('#fld-date', overlay);
    if (dateField) dateField.min = new Date().toISOString().split('T')[0];

    // Focus trap
    const modal = $('.modal', overlay);
    const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
    if (focusable.length) focusable[0].focus();

    overlay.addEventListener('keydown', trapFocus);
  }

  function closeBookingModal() {
    const overlay = $('#booking-modal');
    if (!overlay) return;

    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    overlay.removeEventListener('keydown', trapFocus);

    // Reset form and hide success
    const form = $('#booking-form', overlay);
    if (form) {
      form.reset();
      form.style.display = '';
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    }
    const success = $('.form-success', overlay);
    if (success) success.classList.remove('show');

    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const modal = $('.modal', $('#booking-modal'));
    const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ── Booking Form Validation ──────────────────────────── */
  function initBookingForm() {
    const form = $('#booking-form');
    if (!form) return;

    form.addEventListener('submit', validateBookingForm);
  }

  function validateBookingForm(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;
    let firstInvalid = null;

    // Clear previous
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));

    // Name
    const name = $('#fld-name', form);
    if (name && name.value.trim().length < 2) {
      setInvalid(name, 'Please enter your full name (at least 2 characters).');
      if (!firstInvalid) firstInvalid = name;
      isValid = false;
    }

    // Phone
    const phone = $('#fld-phone', form);
    const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;
    if (phone && !phonePattern.test(phone.value.trim())) {
      setInvalid(phone, 'Please enter a phone number, e.g. +1 555 555 5555.');
      if (!firstInvalid) firstInvalid = phone;
      isValid = false;
    }

    // Email
    const email = $('#fld-email', form);
    if (email && !email.validity.valid) {
      setInvalid(email, 'Please enter a valid email address.');
      if (!firstInvalid) firstInvalid = email;
      isValid = false;
    }

    // Date (optional, but if filled must be >= today)
    const date = $('#fld-date', form);
    if (date && date.value) {
      const today = new Date().toISOString().split('T')[0];
      if (date.value < today) {
        setInvalid(date, 'Please select today or a future date.');
        if (!firstInvalid) firstInvalid = date;
        isValid = false;
      }
    }

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate success
    /*
     * Production: Replace with secure POST endpoint.
     * Example:
     * fetch('/api/booking', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
     *   body: JSON.stringify(formData)
     * }).then(res => { ... });
     *
     * IMPORTANT: Ensure HTTPS, CSRF protection, rate-limiting, HIPAA compliance.
     */

    // GTM Example:
    // dataLayer.push({
    //   event: 'booking_request',
    //   service: form.querySelector('#fld-service').value,
    //   doctor: localStorage.getItem('toothcare_last_doc') || ''
    // });

    form.style.display = 'none';
    const success = form.parentElement.querySelector('.form-success');
    if (success) success.classList.add('show');
  }

  function setInvalid(field, message) {
    field.setAttribute('aria-invalid', 'true');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

})();
