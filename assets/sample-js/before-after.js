/**
 * TOOTHCARE — Before/After Slider Module
 * Draggable handle + keyboard arrow support
 */
(function () {
  'use strict';

  document.querySelectorAll('.before-after__slider').forEach(slider => {
    const handle = slider.querySelector('.before-after__handle');
    const afterWrap = slider.querySelector('.before-after__after-wrap');
    if (!handle || !afterWrap) return;

    let dragging = false;

    function update(x) {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    document.addEventListener('mousemove', e => { if (dragging) update(e.clientX); });
    document.addEventListener('mouseup', () => { dragging = false; });

    handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    document.addEventListener('touchmove', e => { if (dragging && e.touches.length) update(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });

    slider.addEventListener('click', e => { if (e.target !== handle) update(e.clientX); });

    handle.addEventListener('keydown', e => {
      const cur = parseInt(handle.getAttribute('aria-valuenow'), 10);
      let val = cur;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { val = Math.max(0, cur - 5); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { val = Math.min(100, cur + 5); e.preventDefault(); }
      else if (e.key === 'Home') { val = 0; e.preventDefault(); }
      else if (e.key === 'End') { val = 100; e.preventDefault(); }
      if (val !== cur) { afterWrap.style.width = val + '%'; handle.style.left = val + '%'; handle.setAttribute('aria-valuenow', val); }
    });
  });
})();
