

/* --- Extracted from original HTML --- */

// Year
    document.getElementById('y').textContent = new Date().getFullYear();

    // Mobile menu toggle (guarded for safety)
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenuRoot = document.getElementById('mobileMenu');
    const mobileMenuPanel = mobileMenuRoot ? mobileMenuRoot.querySelector('div') : null;

    function toggleMenu() {
      if (!mobileMenuPanel) return;
      const isHidden = mobileMenuPanel.classList.contains('hidden');
      mobileMenuPanel.classList.toggle('hidden', !isHidden);
      menuBtn.setAttribute('aria-expanded', String(isHidden));
    }

    if (menuBtn && mobileMenuPanel) {
      menuBtn.addEventListener('click', toggleMenu);
      mobileMenuPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        if (!mobileMenuPanel.classList.contains('hidden')) toggleMenu();
      }));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenuPanel.classList.contains('hidden')) toggleMenu();
      });
    }

    // ---- IntersectionObserver: add .in to .reveal when visible ----
    const obs = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target);} });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.1}) : null;

    document.querySelectorAll('.reveal').forEach(el=>{ if(obs) obs.observe(el); else el.classList.add('in'); });

    // ---- Magnetic hover (gentle) for elements with .magnet ----
    const magnets = document.querySelectorAll('.magnet');
    magnets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) / (r.width/2);
        const y = (e.clientY - r.top - r.height/2) / (r.height/2);
        el.style.transform = `translate(${x*4}px, ${y*4}px)`; // subtle
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
    });

    // ---- Subtle tilt for cards with [data-tilt] ----
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      const max = 4; // degrees
      const reset = () => { el.style.transform = ''; el.style.transition = 'transform 300ms var(--ease)'; setTimeout(()=>{el.style.transition='';}, 300); };
      el.addEventListener('mousemove', (e) => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width - 0.5;
        const py = (e.clientY - b.top) / b.height - 0.5;
        el.style.transform = `rotateX(${-py*max}deg) rotateY(${px*max}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', reset);
    });

    // ---- Cursor-follow glow ----
    const glow = document.getElementById('glow');
    let raf;
    window.addEventListener('mousemove', (e)=>{
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    });

    // Respect reduced motion: disable interactive effects
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      document.querySelectorAll('[data-tilt]').forEach(el=>el.removeAttribute('data-tilt'));
      document.getElementById('glow').style.display = 'none';
    }
