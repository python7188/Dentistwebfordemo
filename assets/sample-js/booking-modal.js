/**
 * TOOTHCARE — Booking Modal Module
 * Focus trap, ESC close, step navigation, validation, webhook
 */
(function () {
  'use strict';

  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  const form = document.getElementById('booking-form');
  const closeBtn = modal.querySelector('.booking-modal__close');
  const backdrop = modal.querySelector('.booking-modal__backdrop');
  const panels = modal.querySelectorAll('.booking-modal__panel');
  const steps = modal.querySelectorAll('.booking-step');
  const prevBtn = document.getElementById('booking-prev');
  const nextBtn = document.getElementById('booking-next');
  const submitBtn = document.getElementById('booking-submit');
  let currentStep = 1;
  let triggerEl = null;

  function trapFocus(e) {
    const focusable = modal.querySelectorAll('button:not([hidden]):not([disabled]), [href], input:not([hidden]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex]:not([tabindex="-1"]):not([hidden])');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(doctor) {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    modal.addEventListener('keydown', trapFocus);
    closeBtn.focus();
    if (doctor) {
      const sel = document.getElementById('booking-provider');
      if (sel) [...sel.options].forEach(o => { if (o.value.toLowerCase().includes(doctor.replace(/-/g, ' '))) o.selected = true; });
    }
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const t = new Date(); t.setDate(t.getDate() + 1);
      dateInput.min = t.toISOString().split('T')[0];
    }
  }

  function close() {
    modal.classList.remove('is-open');
    setTimeout(() => { modal.hidden = true; document.body.style.overflow = ''; modal.removeEventListener('keydown', trapFocus); if (triggerEl) { triggerEl.focus(); triggerEl = null; } }, 320);
  }

  function showStep(n) {
    currentStep = n;
    panels.forEach(p => p.setAttribute('aria-hidden', +p.dataset.panel !== n));
    steps.forEach(s => { s.classList.remove('active', 'completed'); if (+s.dataset.step === n) s.classList.add('active'); else if (+s.dataset.step < n) s.classList.add('completed'); });
    if (prevBtn) prevBtn.hidden = n === 1;
    if (nextBtn) nextBtn.hidden = n === 5;
    if (submitBtn) submitBtn.hidden = n !== 5;
  }

  function validate(step) {
    let valid = true;
    if (step === 1) { const s = document.getElementById('booking-service'); if (!s.value) { s.classList.add('is-invalid'); valid = false; } else s.classList.remove('is-invalid'); }
    if (step === 3) {
      ['booking-date', 'booking-time'].forEach(id => { const el = document.getElementById(id); if (!el.value) { el.classList.add('is-invalid'); valid = false; } else el.classList.remove('is-invalid'); });
    }
    if (step === 4) {
      const n = document.getElementById('booking-name'), e = document.getElementById('booking-email'), p = document.getElementById('booking-phone');
      if (!n.value || n.value.trim().length < 2) { n.classList.add('is-invalid'); valid = false; } else n.classList.remove('is-invalid');
      if (!e.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value)) { e.classList.add('is-invalid'); valid = false; } else e.classList.remove('is-invalid');
      if (!p.value || p.value.trim().length < 5) { p.classList.add('is-invalid'); valid = false; } else p.classList.remove('is-invalid');
    }
    return valid;
  }

  document.querySelectorAll('.book-trigger, [href="#booking"]').forEach(t => {
    t.addEventListener('click', e => { e.preventDefault(); triggerEl = t; open(t.dataset.doctor || null); });
  });

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  nextBtn?.addEventListener('click', () => { if (validate(currentStep)) showStep(currentStep + 1); });
  prevBtn?.addEventListener('click', () => showStep(currentStep - 1));

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const code = document.getElementById('booking-country-code')?.value || '+91';
    const phone = document.getElementById('booking-phone')?.value || '';
    const payload = {
      clinic: '{{CLINIC_NAME}}',
      service: document.getElementById('booking-service')?.value,
      provider: document.getElementById('booking-provider')?.value || null,
      datetime: `${document.getElementById('booking-date')?.value}T${document.getElementById('booking-time')?.value}:00`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      patient: { name: document.getElementById('booking-name')?.value, email: document.getElementById('booking-email')?.value, phone_e164: code + phone.replace(/\D/g, ''), notes: document.getElementById('booking-notes')?.value || '' },
      source: 'website',
      utm: { source: new URLSearchParams(location.search).get('utm_source') || '' }
    };
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));
    // fetch('{{WEBHOOK_URL}}', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    document.getElementById('booking-summary').hidden = true;
    document.getElementById('booking-success').hidden = false;
    submitBtn.hidden = true;
    prevBtn.hidden = true;
  });

  showStep(1);
})();
