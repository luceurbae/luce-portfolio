(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      navigation.classList.toggle('is-open', !isOpen);
    });
    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
      });
    });
  }

  // Split headline into words for the load-in reveal
  function splitIntoWords(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let index = 0;
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(part);
          return;
        }
        const word = document.createElement('span');
        word.className = 'word';
        word.style.setProperty('--word-index', index);
        word.textContent = part;
        index += 1;
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });
  }

  document.querySelectorAll('.split-text').forEach(splitIntoWords);
  requestAnimationFrame(() => document.body.classList.add('text-ready'));

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    revealElements.forEach((element) => observer.observe(element));
  }

  // Spotlight cursor on lens cards
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
      });
    });
  }

  // Tab groups (hero overview panel)
  function initTabGroup(root) {
    const tabs = Array.from(root.querySelectorAll('[data-tab]'));
    const panels = Array.from(root.querySelectorAll('[data-panel]'));
    if (tabs.length === 0) return null;
    const activate = (name) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === name;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.panel === name;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.tab)));
    return activate;
  }

  const heroMockup = document.querySelector('#hero-mockup');
  if (heroMockup) {
    const activate = initTabGroup(heroMockup);
    if (activate && !reduceMotion) {
      const order = Array.from(heroMockup.querySelectorAll('[data-tab]')).map(
        (tab) => tab.dataset.tab
      );
      let current = 0;
      let timer = null;
      let lockedByUser = false;
      const stop = () => {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };
      const start = () => {
        stop();
        if (lockedByUser) return;
        timer = window.setInterval(() => {
          current = (current + 1) % order.length;
          activate(order[current]);
        }, 5500);
      };
      heroMockup.querySelectorAll('[data-tab]').forEach((tab) => {
        tab.addEventListener('click', () => {
          current = order.indexOf(tab.dataset.tab);
          lockedByUser = true;
          stop();
        });
      });
      heroMockup.addEventListener('pointerenter', stop);
      heroMockup.addEventListener('pointerleave', start);
      heroMockup.addEventListener('focusin', stop);
      heroMockup.addEventListener('focusout', start);
      start();
    }
  }

  // Filter tabs inside work mockups
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const pills = Array.from(group.querySelectorAll('[data-filter]'));
    const rows = Array.from(group.querySelectorAll('[data-status]'));
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((item) => item.classList.toggle('is-active', item === pill));
        rows.forEach((row) => {
          const show = pill.dataset.filter === 'all' || row.dataset.status === pill.dataset.filter;
          row.hidden = !show;
          if (show) {
            row.style.animation = 'none';
            void row.offsetWidth;
            row.style.animation = '';
          }
        });
      });
    });
  });

  // Count-up stats
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }
    element.textContent = '0';
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((element) => counterObserver.observe(element));
  } else {
    counters.forEach(runCounter);
  }
})();
