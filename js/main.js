/* ============================================================
   Ali Ibrahim Al Safwan — portfolio scripts
   Modules: theme · mobile nav · scroll (header/progress/top/spy)
            reveal · counters · terminal · canvas · footer year
   No dependencies. Everything degrades gracefully without JS.
   ============================================================ */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     THEME — toggle + persist; the <head> inline script already
     applied the initial theme before first paint.
  ---------------------------------------------------------- */
  var themeToggle = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    // Keep the chat widget in the same theme as the site
    var pcRoot = document.querySelector('.pc-root');
    if (pcRoot) pcRoot.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f5f8fc' : '#0a0f1c');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(docEl.getAttribute('data-theme') === 'light'));
    themeToggle.addEventListener('click', function () {
      var next = docEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  /* ----------------------------------------------------------
     MOBILE NAV — toggle, close on link click / Escape / outside
  ---------------------------------------------------------- */
  var nav = document.getElementById('primary-nav');
  var navToggle = document.getElementById('nav-toggle');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (!e.target.closest('#primary-nav') && !e.target.closest('#nav-toggle')) setNav(false);
    });
  }

  /* ----------------------------------------------------------
     SCROLL — header background, progress bar, back-to-top
  ---------------------------------------------------------- */
  var header = document.getElementById('site-header');
  var progress = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || docEl.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 560);
    if (progress) {
      var max = docEl.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? (Math.min(y / max, 1) * 100).toFixed(2) + '%' : '0%';
    }
    ticking = false;
  }
  document.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     SCROLL SPY — highlight the nav link of the visible section
  ---------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var spySections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ----------------------------------------------------------
     REVEAL — fade/rise on first view, staggered per section
  ---------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var skillItems = Array.prototype.slice.call(document.querySelectorAll('.skill-item'));

  // Assign small stagger delays based on position within the parent section
  var bySection = new Map();
  revealEls.forEach(function (el) {
    var section = el.closest('section') || document.body;
    var i = bySection.get(section) || 0;
    el.style.setProperty('--reveal-delay', Math.min(i, 6) * 70 + 'ms');
    bySection.set(section, i + 1);
  });

  function showAll() {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    skillItems.forEach(function (el) { el.classList.add('in-view'); });
  }

  if (reducedMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    skillItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     COUNTERS — count stat numbers up when they enter view
  ---------------------------------------------------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reducedMotion) { el.textContent = String(target); return; }
    var duration = 700;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && !reducedMotion) {
    var countObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ----------------------------------------------------------
     TERMINAL — the hero types a "profile scan" of the owner.
     Screen readers get the full transcript from the container's
     aria-label; the animation itself is aria-hidden.
  ---------------------------------------------------------- */
  var terminalBody = document.getElementById('terminal-body');

  var SCRIPT = [
    { type: 'cmd',  text: './profile_scan.sh --target self' },
    { type: 'dim',  text: 'scanning profile ...' },
    { type: 'ok',   text: 'role ......... IT & Network Security' },
    { type: 'ok',   text: 'status ....... final-semester student' },
    { type: 'ok',   text: 'experience ... Worley IT · Feb–Apr 2026' },
    { type: 'ok',   text: 'certified .... Worley co-op training' },
    { type: 'ok',   text: 'interests .... network defense · AI' },
    { type: 'cmd',  text: 'open ./projects', caret: true }
  ];

  function lineEl(step) {
    var p = document.createElement('p');
    p.className = 't-line';
    if (step.type === 'cmd') {
      var prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = '$ ';
      p.appendChild(prompt);
    } else if (step.type === 'ok' || step.type === 'warn') {
      var tag = document.createElement('span');
      tag.className = step.type === 'ok' ? 't-ok' : 't-warn';
      tag.textContent = step.type === 'ok' ? '[ OK ] ' : '[ .. ] ';
      p.appendChild(tag);
    }
    var body = document.createElement('span');
    if (step.type === 'dim') body.className = 't-dim';
    p.appendChild(body);
    return { root: p, body: body };
  }

  function renderTerminalInstant() {
    SCRIPT.forEach(function (step) {
      var line = lineEl(step);
      line.body.textContent = step.text;
      terminalBody.appendChild(line.root);
    });
    appendCaret();
  }

  function appendCaret() {
    var last = terminalBody.lastElementChild;
    if (!last) return;
    var caret = document.createElement('span');
    caret.className = 't-caret';
    last.appendChild(caret);
  }

  function typeTerminal() {
    var stepIndex = 0;

    function nextStep() {
      if (stepIndex >= SCRIPT.length) { appendCaret(); return; }
      var step = SCRIPT[stepIndex++];
      var line = lineEl(step);
      terminalBody.appendChild(line.root);

      if (step.type === 'cmd') {
        // Commands are "typed" character by character
        var i = 0;
        (function typeChar() {
          line.body.textContent = step.text.slice(0, ++i);
          if (i < step.text.length) {
            setTimeout(typeChar, 26 + Math.random() * 34);
          } else {
            setTimeout(nextStep, step.caret ? 0 : 320);
          }
        })();
      } else {
        // Output lines print whole, in quick succession
        line.body.textContent = step.text;
        setTimeout(nextStep, step.type === 'dim' ? 520 : 190);
      }
    }

    setTimeout(nextStep, 500);
  }

  if (terminalBody) {
    if (reducedMotion) {
      renderTerminalInstant();
    } else if ('IntersectionObserver' in window) {
      var termObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            typeTerminal();
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      termObserver.observe(terminalBody);
    } else {
      typeTerminal();
    }
  }

  /* ----------------------------------------------------------
     CANVAS — quiet constellation behind the hero: drifting
     nodes, linked when near. Skipped for reduced motion and
     paused when the tab is hidden.
  ---------------------------------------------------------- */
  var canvas = document.getElementById('network-canvas');

  if (canvas && !reducedMotion && window.requestAnimationFrame) {
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var rafId = null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function accent() {
      return getComputedStyle(docEl).getPropertyValue('--accent').trim() || '#3fd3ee';
    }

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.max(18, Math.min(46, Math.floor(rect.width / 34)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 1 + Math.random() * 1.4
        });
      }
    }

    function frame() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      var color = accent();
      var LINK = 130;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK) {
            ctx.globalAlpha = (1 - dist / LINK) * 0.13;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(frame);
    }

    function start() { if (rafId === null) rafId = requestAnimationFrame(frame); }
    function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

    resize();
    start();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  }

  /* ----------------------------------------------------------
     FOOTER YEAR
  ---------------------------------------------------------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
