/**
 * DOCTORS — animations.js
 * Primary: Vanilla build using native Web Animations API + IntersectionObserver
 * with GSAP-compatible easing values.
 *
 * Alternative (React): Replace with Framer Motion variants as noted in comments.
 * GSAP CDN: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
 */

'use strict';

/* ─── Utility: reduced motion guard ─── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Easing strings ─── */
const EASE_MAIN = 'cubic-bezier(.2,.9,.3,1)';   /* power3.out equivalent */

/* ══════════════════════════════════════════════
   1. PRELOADER
   Sequence: logo opacity 0→1, scale 0.92→1 (spring-like), bar left→right, crossfade out
   Duration: 1.2s total
══════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const logo      = preloader?.querySelector('.preloader__logo');
  const page      = document.getElementById('page');

  if (!preloader || !page) return;

  if (prefersReducedMotion) {
    preloader.classList.add('hidden');
    page.removeAttribute('aria-hidden');
    page.classList.add('visible');
    // Immediately show all cards
    revealAllCards();
    revealTeeth();
    return;
  }

  /* Logo: opacity 0→1, scale 0.92→1 with spring-ish params */
  logo?.animate([
    { opacity: 0, transform: 'scale(0.92)' },
    { opacity: 1, transform: 'scale(1)'    }
  ], {
    duration: 900,
    delay: 100,
    easing: EASE_MAIN,
    fill: 'forwards'
  });

  /* After 1.2s, crossfade preloader out and reveal page */
  setTimeout(() => {
    preloader.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: 500,
      easing: 'ease',
      fill: 'forwards'
    }).onfinish = () => {
      preloader.classList.add('hidden');
      preloader.setAttribute('aria-hidden', 'true');
      page.removeAttribute('aria-hidden');
      page.classList.add('visible');
      /* Kick off card entrances */
      scheduleCardEntrances();
      revealTeeth();
    };
  }, 1400);
}

/* ══════════════════════════════════════════════
   2. CARD ENTRANCE
   y: 40px→0, opacity: 0→1, scale: 0.98→1
   stagger: 0.12s, duration: 0.8s
   ease: cubic-bezier(.2,.9,.3,1)

   React/Framer alternative:
   const containerVariants = {
     hidden: {},
     visible: { transition: { staggerChildren: 0.12 } }
   };
   const cardVariants = {
     hidden: { y: 40, opacity: 0, scale: 0.98 },
     visible: { y: 0, opacity: 1, scale: 1,
       transition: { duration: 0.8, ease: [.2,.9,.3,1] } }
   };
══════════════════════════════════════════════ */
function scheduleCardEntrances() {
  const cards = document.querySelectorAll('.card');

  if (prefersReducedMotion) {
    cards.forEach(c => {
      c.style.opacity = '1';
      c.style.transform = 'none';
    });
    return;
  }

  cards.forEach((card, i) => {
    const delay = i * 120; /* 0.12s stagger in ms */
    setTimeout(() => animateCardIn(card), delay);
  });
}

function revealAllCards() {
  document.querySelectorAll('.card').forEach(c => {
    c.style.opacity = '1';
    c.style.transform = 'none';
  });
}

function animateCardIn(card) {
  card.animate([
    { opacity: 0, transform: 'translateY(40px) scale(0.98)' },
    { opacity: 1, transform: 'translateY(0) scale(1)'       }
  ], {
    duration: 800,
    easing: EASE_MAIN,
    fill: 'forwards'
  });
}

/* ══════════════════════════════════════════════
   3. IMAGE REVEAL (LQIP → hi-res crossfade)
   blur(12px) → blur(0) over 450ms
══════════════════════════════════════════════ */
function initImageReveal() {
  const imgs = document.querySelectorAll('.card__img');

  imgs.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        if (prefersReducedMotion) {
          img.classList.add('loaded');
          return;
        }
        img.animate([
          { filter: 'blur(12px)' },
          { filter: 'blur(0)'   }
        ], {
          duration: 450,
          easing: 'ease',
          fill: 'forwards'
        }).onfinish = () => img.classList.add('loaded');
      }, { once: true });
    }
  });
}

/* ══════════════════════════════════════════════
   4. HOVER 3D TILT MICRO-INTERACTION
   perspective(1000px) rotateX/rotateY ±6°
   cursor parallax, 280ms ease
   
   React/Framer alternative:
   useMotionValue(x/y) + useTransform → rotateX/rotateY
══════════════════════════════════════════════ */
function initTiltEffect() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', onCardMouseMove);
    card.addEventListener('mouseleave', onCardMouseLeave);
  });
}

function onCardMouseMove(e) {
  const card   = e.currentTarget;
  const rect   = card.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const dx     = (e.clientX - cx) / (rect.width  / 2); /* -1 → 1 */
  const dy     = (e.clientY - cy) / (rect.height / 2);
  const rotX   = -(dy * 6).toFixed(2);  /* ±6° */
  const rotY   =  (dx * 6).toFixed(2);

  card.style.transition = `transform 280ms ${EASE_MAIN}, box-shadow 280ms ${EASE_MAIN}`;
  card.style.transform  = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;

  /* Parallax on inner image */
  const img = card.querySelector('.card__img');
  if (img) {
    const px = (dx * 8).toFixed(2);
    const py = (dy * 8).toFixed(2);
    img.style.transform = `translate(${px}px, ${py}px) scale(1.04)`;
    img.style.transition = `transform 280ms ${EASE_MAIN}`;
  }
}

function onCardMouseLeave(e) {
  const card = e.currentTarget;
  card.style.transition = `transform 400ms ${EASE_MAIN}, box-shadow 400ms ${EASE_MAIN}`;
  card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';

  const img = card.querySelector('.card__img');
  if (img) {
    img.style.transform = 'translate(0,0) scale(1)';
    img.style.transition = `transform 400ms ${EASE_MAIN}`;
  }
}

/* ══════════════════════════════════════════════
   5. SCROLL-DRIVEN PARALLAX
   multiplier: 0.06 — cards drift on scroll
   
   GSAP alternative:
   gsap.to('.card', {
     y: (i, el) => -ScrollTrigger.maxScroll(window) * 0.06,
     ease: "none",
     scrollTrigger: { scrub: true }
   });
══════════════════════════════════════════════ */
function initScrollParallax() {
  if (prefersReducedMotion) return;

  const MULTIPLIER = 0.06;
  let lastScrollY  = window.scrollY;
  let rafId        = null;

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      document.querySelectorAll('.card').forEach((card, i) => {
        /* Alternate direction for depth feel */
        const dir    = i % 2 === 0 ? 1 : -1;
        const offset = scrollDelta * MULTIPLIER * dir;
        const current = getComputedTranslateY(card);
        card.style.transform = card.style.transform
          ? card.style.transform.replace(/translateY\([^)]*\)/, '') + ` translateY(${current + offset}px)`
          : `translateY(${offset}px)`;
      });

      rafId = null;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

function getComputedTranslateY(el) {
  const t = new DOMMatrix(getComputedStyle(el).transform);
  return t.m42 || 0;
}

/* ══════════════════════════════════════════════
   6. BORDER DRAW ON HOVER
   SVG stroke-dashoffset full → 0, 0.9s power2.out
   (CSS handles it via .card:hover .border-path)
   This JS watches focus events for keyboard nav.
══════════════════════════════════════════════ */
function initBorderDraw() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.card').forEach(card => {
    const borderPath = card.querySelector('.border-path');
    if (!borderPath) return;

    /* Measure actual perimeter and set dasharray */
    try {
      const perimeter = borderPath.getTotalLength?.() || 395;
      borderPath.style.strokeDasharray  = perimeter;
      borderPath.style.strokeDashoffset = perimeter;
    } catch (_) {
      /* fallback already in CSS */
    }
  });
}

/* ══════════════════════════════════════════════
   7. TEETH DOODLE REVEAL (scroll-triggered)
══════════════════════════════════════════════ */
function revealTeeth() {
  const teeth = document.querySelector('.teeth-doodle');
  if (!teeth) return;

  if (prefersReducedMotion) {
    teeth.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        teeth.classList.add('visible');
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(teeth);
}

/* ══════════════════════════════════════════════
   8. MOBILE DRAG CAROUSEL (touch + mouse)
   Inertia-based drag for .cards-section on mobile
══════════════════════════════════════════════ */
function initMobileDrag() {
  const carousel = document.querySelector('.cards-section');
  if (!carousel) return;
  if (window.innerWidth > 767) return;

  let isDown   = false;
  let startX   = 0;
  let scrollLeft = 0;
  let velocity = 0;
  let lastX    = 0;
  let animId   = null;

  carousel.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    lastX = e.pageX;
    cancelAnimationFrame(animId);
  });

  carousel.addEventListener('mouseleave', () => { isDown = false; });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    applyInertia();
  });

  carousel.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.2;
    velocity = e.pageX - lastX;
    lastX = e.pageX;
    carousel.scrollLeft = scrollLeft - walk;
  });

  /* Touch */
  carousel.addEventListener('touchstart', e => {
    startX     = e.touches[0].pageX;
    scrollLeft = carousel.scrollLeft;
    lastX      = e.touches[0].pageX;
    cancelAnimationFrame(animId);
  }, { passive: true });

  carousel.addEventListener('touchmove', e => {
    const x    = e.touches[0].pageX;
    velocity   = x - lastX;
    lastX      = x;
    const walk = (startX - x) * 1.1;
    carousel.scrollLeft = scrollLeft + walk;
  }, { passive: true });

  carousel.addEventListener('touchend', applyInertia);

  function applyInertia() {
    let vel = velocity;
    function step() {
      if (Math.abs(vel) < 0.5) return;
      carousel.scrollLeft -= vel;
      vel *= 0.92; /* friction */
      animId = requestAnimationFrame(step);
    }
    animId = requestAnimationFrame(step);
  }
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initImageReveal();
  initTiltEffect();
  initBorderDraw();
  initScrollParallax();
  initMobileDrag();
  // revealTeeth() called after preloader exits (or immediately if reduced motion)
});

/*
 ════════════════════════════════════════════════
 REACT / FRAMER MOTION ALTERNATIVE NOTES
 ════════════════════════════════════════════════

 Option B — React build:

 1. Install: npm install framer-motion lottie-react gsap @gsap/react

 2. Card entrance (Framer):
    const card = { hidden: {y:40,opacity:0,scale:0.98},
                   visible: {y:0,opacity:1,scale:1,
                     transition:{duration:.8,ease:[.2,.9,.3,1]}} };
    <motion.article variants={card} initial="hidden" animate="visible" />

 3. Stagger parent:
    const container = { visible: {transition:{staggerChildren:.12}} };

 4. Preloader (Framer):
    <motion.div initial={{opacity:0,scale:.92}}
      animate={{opacity:1,scale:1}}
      transition={{type:"spring",damping:12,stiffness:90}} />

 5. 3D tilt (Framer):
    const x = useMotionValue(0); const y = useMotionValue(0);
    const rotX = useTransform(y,[-100,100],["6deg","-6deg"]);
    const rotY = useTransform(x,[-100,100],["-6deg","6deg"]);
    <motion.div style={{rotateX:rotX, rotateY:rotY, perspective:1000}} />

 6. Scroll parallax (GSAP + ScrollTrigger in React):
    import gsap from "gsap";
    import ScrollTrigger from "gsap/ScrollTrigger";
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(cardRef.current, {
      y: -40,
      ease: "none",
      scrollTrigger: { scrub: 0.5, start: "top bottom", end: "bottom top" }
    });
*/
