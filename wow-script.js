document.addEventListener('DOMContentLoaded', () => {
  // Check if mobile or reduced motion
  if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Ensure libraries are loaded
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('WOW libraries failed to load. Are you offline?');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 1. Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0, 0);

  // 2. Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.animate({
        left: posX + 'px',
        top: posY + 'px'
      }, { duration: 0, fill: 'forwards' });

      cursorOutline.animate({
        left: posX + 'px',
        top: posY + 'px'
      }, { duration: 500, fill: 'forwards' });
    });

    const hoverTargets = document.querySelectorAll('a, button, .magnetic, .ai-upload-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 3. Magnetic Buttons
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const w = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - w;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.5s ease-out';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  // 4. Parallax Images & 3D Distortion Hover
  gsap.utils.toArray('.img-editorial').forEach(img => {
    // Scroll Parallax
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      ScrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // 3D Distortion Hover (WebGL alternative)
    img.parentElement.style.perspective = "1000px";
    img.parentElement.addEventListener('mousemove', (e) => {
      const rect = img.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRot = ((y / rect.height) - 0.5) * -20; 
      const yRot = ((x / rect.width) - 0.5) * 20; 
      gsap.to(img, {
        rotationX: xRot,
        rotationY: yRot,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    img.parentElement.addEventListener('mouseleave', () => {
      gsap.to(img, { rotationX: 0, rotationY: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // 4b. Horizontal Scroll Section
  const horizontalSection = document.querySelector('.horizontal-scroll-section');
  const horizontalContainer = document.querySelector('.horizontal-scroll-container');
  if (horizontalSection && horizontalContainer) {
    let scrollTween = gsap.to(horizontalContainer, {
      x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
      ease: "none",
      ScrollTrigger: {
        trigger: horizontalSection,
        pin: true,
        scrub: 1,
        end: () => "+=" + horizontalContainer.scrollWidth
      }
    });
  }

  // 5. AI Smile Simulator Logic
  const aiBtn = document.getElementById('trigger-ai-btn');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      aiBtn.style.display = 'none';
      const img = document.getElementById('ai-demo-img');
      const grid = document.getElementById('ai-grid');
      const scanLine = document.getElementById('ai-scan-line');
      const dataPoints = document.getElementById('ai-data-points');
      
      const tl = gsap.timeline();
      
      tl.to(img, { opacity: 0.8, filter: 'grayscale(0%)', duration: 3 })
        .to(grid, { opacity: 1, duration: 0.5 }, '-=3')
        .to(scanLine, { opacity: 1, duration: 0.2 }, '-=3')
        .to(scanLine, { y: document.querySelector('.ai-simulator-wrapper').offsetHeight, duration: 2.5, ease: 'linear' }, '-=2.8')
        .to(dataPoints, { opacity: 1, duration: 0.2 }, '-=3')
        .call(() => {
          let dots = 0;
          const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            dataPoints.innerHTML = 'ANALYZING FACIAL STRUCTURE' + '.'.repeat(dots);
          }, 300);
          setTimeout(() => {
            clearInterval(interval);
            dataPoints.innerHTML = 'SMILE OPTIMIZED <br> <span style="color:#FFF">Match: 99.8%</span>';
            gsap.to(grid, { opacity: 0, duration: 1 });
            gsap.to(scanLine, { opacity: 0, duration: 0.5 });
            gsap.to(img, { opacity: 1, duration: 1 });
          }, 2500);
        }, null, '-=3');
    });
  }

});
