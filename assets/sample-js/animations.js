/**
 * TOOTHCARE — Animations Module
 * Scroll reveal, brush-stroke parallax, prefers-reduced-motion
 */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll Reveal
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (reducedMotion) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  }
  initReveal();

  // Brush-Stroke Parallax
  function initParallax() {
    if (reducedMotion) return;
    const brushes = document.querySelectorAll('.hero__brush, .why__brush, .cta-strip__brush');
    if (!brushes.length) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          brushes.forEach(b => {
            const offset = (b.getBoundingClientRect().top / window.innerHeight - 0.5) * 16;
            b.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  initParallax();
})();
