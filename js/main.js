/* ================================================================
   RAMANI SHRI FOUNDATION — MAIN JS
   Vanilla JavaScript · No dependencies
   ----------------------------------------------------------------
   Modules:
   1. Mobile navigation toggle
   2. Sticky header shadow on scroll
   3. Scroll-reveal animations (IntersectionObserver)
   4. Active nav link highlighting (scroll spy)
   5. Back-to-top button
   6. Smooth-scroll fallback for anchor links
   7. Current year in footer
   8. Hero slider (auto-play, dots, fade, parallax)
   9. Animated counters (count up on scroll)
   10. Gallery lightbox
   11. Newsletter form validation
   12. FAQ accordion
   13. Donation widget (tabs + amount chips)
   14. Generic form validation (contact / volunteer)
   15. Social share buttons
================================================================ */

(function () {
  'use strict';

  /* Run after DOM is ready */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initScrollSpy();
    initBackToTop();
    initSmoothScroll();
    initFooterYear();
    initHeroSlider();
    initCounters();
    initLightbox();
    initNewsletter();
    initAccordion();
    initDonationWidget();
    initFormValidation();
    initShare();
  }

  /* ==============================================================
     1. MOBILE NAVIGATION TOGGLE
  ============================================================== */
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close the menu when a link is clicked */
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    /* Close when resizing up to desktop */
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1100) closeMenu();
    });
  }

  /* ==============================================================
     2. STICKY HEADER SHADOW ON SCROLL
  ============================================================== */
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ==============================================================
     3. SCROLL-REVEAL ANIMATIONS
     Add class "reveal" to any element to fade it in on scroll.
  ============================================================== */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    /* Fallback: if IntersectionObserver is unsupported, show everything */
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ==============================================================
     4. SCROLL SPY — highlight active nav link
  ============================================================== */
  function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');
    if (!sections.length || !navLinks.length) return;
    if (!('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isActive);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ==============================================================
     5. BACK-TO-TOP BUTTON
  ============================================================== */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleBtn = () => {
      const show = window.scrollY > 400;
      btn.hidden = !show;
      btn.classList.toggle('is-visible', show);
    };

    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });

    btn.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ==============================================================
     6. SMOOTH SCROLL FALLBACK for in-page anchor links
     (CSS scroll-behavior handles most cases; this respects
      reduced-motion and accounts for the sticky header.)
  ============================================================== */
  function initSmoothScroll() {
    const header = document.getElementById('site-header');
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;

        window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
        /* Move focus for accessibility */
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ==============================================================
     7. CURRENT YEAR IN FOOTER
  ============================================================== */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ==============================================================
     8. HERO SLIDER
     Cross-fading background slider with auto-play, manual dots
     and a subtle parallax effect on scroll.
  ============================================================== */
  function initHeroSlider() {
    const hero = document.getElementById('hero');
    const slidesWrap = document.getElementById('hero-slides');
    const dotsWrap = document.getElementById('hero-dots');
    if (!hero || !slidesWrap || !dotsWrap) return;

    const slides = Array.from(slidesWrap.querySelectorAll('.hero__slide'));
    const dots = Array.from(dotsWrap.querySelectorAll('.hero__dot'));
    if (slides.length < 2) return;

    const INTERVAL = 5000; // auto-advance every 5s
    let current = 0;
    let timer = null;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    };

    const next = () => goTo(current + 1);

    const start = () => {
      stop();
      timer = window.setInterval(next, INTERVAL);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    /* Manual navigation via dots */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        start(); // restart the timer after manual interaction
      });
    });

    /* Pause on hover / focus, resume on leave */
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);

    /* Pause while the tab is hidden to save resources */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    /* ---- Subtle parallax on scroll ---- */
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!reduceMotion) {
      const layers = slidesWrap.querySelectorAll('.hero__bg');
      let ticking = false;

      const applyParallax = () => {
        const offset = window.scrollY * 0.4; // background moves slower
        layers.forEach((layer) => {
          layer.style.transform =
            'translate3d(0, ' + offset + 'px, 0) scale(1.05)';
        });
        ticking = false;
      };

      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            window.requestAnimationFrame(applyParallax);
            ticking = true;
          }
        },
        { passive: true }
      );
      applyParallax();
    }

    /* Kick things off */
    goTo(0);
    start();
  }

  /* ==============================================================
     9. ANIMATED COUNTERS
     Counts each [data-count-to] element up from 0 when it scrolls
     into view (once). Respects reduced-motion.
  ============================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const animate = (el) => {
      const target = parseFloat(el.getAttribute('data-count-to')) || 0;

      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }

      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        /* easeOutCubic for a natural slow-down */
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
        else el.textContent = String(target);
      };

      window.requestAnimationFrame(tick);
    };

    /* Fallback: no IntersectionObserver -> show final values */
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ==============================================================
     10. GALLERY LIGHTBOX
     Opens full-size images in an overlay with prev/next, keyboard
     navigation and backdrop / Escape to close.
  ============================================================== */
  function initLightbox() {
    const grid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (!grid || !lightbox || !imgEl) return;

    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    if (!items.length) return;

    let index = 0;
    let lastFocused = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      const full = item.getAttribute('data-full');
      const thumb = item.querySelector('img');
      imgEl.src = full || (thumb ? thumb.src : '');
      imgEl.alt = thumb ? thumb.alt : '';
    };

    const open = (i) => {
      lastFocused = document.activeElement;
      show(i);
      lightbox.hidden = false;
      /* next frame so the opacity transition runs */
      window.requestAnimationFrame(() => lightbox.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });

    closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', () => show(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(index + 1));

    /* Click on the backdrop (not the image/buttons) closes */
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox__figure')) {
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ==============================================================
     11. NEWSLETTER FORM VALIDATION
  ============================================================== */
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('newsletter-email');
    const msg = document.getElementById('newsletter-msg');
    if (!form || !input || !msg) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setMsg = (text, type) => {
      msg.textContent = text;
      msg.classList.remove('is-error', 'is-success');
      if (type) msg.classList.add('is-' + type);
    };

    /* Clear the error state as the user corrects the field */
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        input.classList.remove('is-invalid');
        setMsg('', null);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();

      if (!value) {
        input.classList.add('is-invalid');
        setMsg('Please enter your email address.', 'error');
        input.focus();
        return;
      }
      if (!EMAIL_RE.test(value)) {
        input.classList.add('is-invalid');
        setMsg('Please enter a valid email address.', 'error');
        input.focus();
        return;
      }

      input.classList.remove('is-invalid');
      setMsg('Thank you for subscribing!', 'success');
      form.reset();
    });
  }

  /* ==============================================================
     12. FAQ ACCORDION
     Toggles [data-accordion] groups. Click a question to expand;
     other panels in the same group close.
  ============================================================== */
  function initAccordion() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach((item) => {
      const btn = item.querySelector('.faq__q');
      const panel = item.querySelector('.faq__a');
      if (!btn || !panel) return;

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        /* Close siblings within the same .faq group */
        const group = item.closest('.faq');
        if (group) {
          group.querySelectorAll('.faq__q[aria-expanded="true"]').forEach((openBtn) => {
            if (openBtn !== btn) {
              openBtn.setAttribute('aria-expanded', 'false');
              const p = openBtn.closest('.faq__item').querySelector('.faq__a');
              if (p) p.style.maxHeight = null;
            }
          });
        }

        btn.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
      });
    });
  }

  /* ==============================================================
     13. DONATION WIDGET
     Tab switching (one-time / monthly / corporate) + amount chips
     with a custom-amount field. UI only — wire to a gateway later.
  ============================================================== */
  function initDonationWidget() {
    const widget = document.getElementById('donate-widget');
    if (!widget) return;

    /* --- Tabs --- */
    const tabs = Array.from(widget.querySelectorAll('.donate-tab'));
    const panels = Array.from(widget.querySelectorAll('.donate-panel'));

    const selectTab = (tab) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
      });
      panels.forEach((p) => {
        p.hidden = p.id !== tab.getAttribute('aria-controls');
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const dir = e.key === 'ArrowRight' ? 1 : -1;
          const next = tabs[(i + dir + tabs.length) % tabs.length];
          selectTab(next);
          next.focus();
        }
      });
    });

    /* --- Amount chips (per panel) --- */
    widget.querySelectorAll('.amount-grid').forEach((grid) => {
      const chips = Array.from(grid.querySelectorAll('.amount-chip'));
      const panel = grid.closest('.donate-panel');
      const custom = panel ? panel.querySelector('.amount-custom__input') : null;

      chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          chips.forEach((c) => c.classList.remove('is-selected'));
          chip.classList.add('is-selected');
          if (custom) custom.value = '';
        });
      });

      if (custom) {
        custom.addEventListener('input', () => {
          chips.forEach((c) => c.classList.remove('is-selected'));
        });
      }
    });

    selectTab(tabs[0]);
  }

  /* ==============================================================
     14. GENERIC FORM VALIDATION
     Validates any [data-validate] form (contact, volunteer, etc.).
     Checks required fields, email format and consent checkboxes.
  ============================================================== */
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    if (!forms.length) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    forms.forEach((form) => {
      const status = form.querySelector('.form__msg');

      const fieldError = (field, message) => {
        field.classList.toggle('is-invalid', Boolean(message));
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        const errEl = form.querySelector('[data-error-for="' + field.name + '"]');
        if (errEl) errEl.textContent = message || '';
      };

      /* Clear error as the user edits */
      form.querySelectorAll('input, textarea, select').forEach((field) => {
        field.addEventListener('input', () => fieldError(field, ''));
        field.addEventListener('change', () => fieldError(field, ''));
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let firstInvalid = null;
        let valid = true;

        form.querySelectorAll('[required]').forEach((field) => {
          let message = '';

          if (field.type === 'checkbox') {
            if (!field.checked) message = 'Please confirm to continue.';
          } else if (!field.value.trim()) {
            message = 'This field is required.';
          } else if (field.type === 'email' && !EMAIL_RE.test(field.value.trim())) {
            message = 'Please enter a valid email address.';
          }

          fieldError(field, message);
          if (message) {
            valid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        });

        if (!valid) {
          if (status) {
            status.textContent = 'Please correct the highlighted fields.';
            status.classList.remove('is-success');
            status.classList.add('is-error');
          }
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        if (status) {
          status.textContent =
            form.getAttribute('data-success') ||
            'Thank you! Your message has been received. We will get back to you soon.';
          status.classList.remove('is-error');
          status.classList.add('is-success');
        }
        form.reset();
      });
    });
  }

  /* ==============================================================
     15. SOCIAL SHARE
     [data-share] buttons open a share window for the current page.
  ============================================================== */
  function initShare() {
    const buttons = document.querySelectorAll('[data-share]');
    if (!buttons.length) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      document.title + ' — support orphaned children with Ramanishri Foundation.'
    );

    const endpoints = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
      twitter: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
      whatsapp: 'https://api.whatsapp.com/send?text=' + text + '%20' + url,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-share');

        if (type === 'copy') {
          e.preventDefault();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
              const original = btn.getAttribute('data-label') || btn.textContent;
              btn.setAttribute('data-label', original.trim());
              btn.querySelector('.share__text')
                ? (btn.querySelector('.share__text').textContent = 'Link copied!')
                : (btn.textContent = 'Link copied!');
            });
          }
          return;
        }

        if (endpoints[type]) {
          e.preventDefault();
          window.open(endpoints[type], 'share', 'width=600,height=500,noopener');
        }
      });
    });
  }
})();
