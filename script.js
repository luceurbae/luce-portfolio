const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

function splitIntoWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
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

function initializeTextEffects() {
  const revealElements = document.querySelectorAll('.reveal-text, .interactive-title');
  revealElements.forEach(splitIntoWords);
  document.body.classList.add('text-ready');

  document.querySelectorAll('.interactive-title').forEach((title) => {
    title.addEventListener('pointerover', (event) => {
      event.target.closest('.word')?.classList.add('is-active');
    });
    title.addEventListener('pointerout', (event) => {
      event.target.closest('.word')?.classList.remove('is-active');
    });
  });

  if (reduceMotion.matches) {
    document.querySelectorAll('.reveal-text').forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.reveal-text').forEach((element) => observer.observe(element));
}

function initializeSpotlights() {
  if (reduceMotion.matches || !window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
    });
  });
}

function initializeBackground() {
  if (reduceMotion.matches) return;

  const canvas = document.querySelector('.interactive-background');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let pointer = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.24 };
  let orbFrame = 0;

  function createParticles() {
    const count = Math.min(80, Math.max(36, Math.round((width * height) / 20000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.45,
      vx: (Math.random() - 0.5) * 0.23,
      vy: (Math.random() - 0.5) * 0.23,
      depth: Math.random() * 0.8 + 0.2
    }));
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const field = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.min(width, height) * 0.44);
    field.addColorStop(0, 'rgba(65, 158, 255, 0.13)');
    field.addColorStop(0.45, 'rgba(33, 105, 190, 0.045)');
    field.addColorStop(1, 'rgba(7, 17, 31, 0)');
    context.fillStyle = field;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -8 || particle.x > width + 8) particle.vx *= -1;
      if (particle.y < -8 || particle.y > height + 8) particle.vy *= -1;

      const distance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);
      const influence = Math.max(0, 1 - distance / 260);
      context.beginPath();
      context.fillStyle = `rgba(130, 202, 255, ${0.1 + influence * 0.58})`;
      context.arc(particle.x, particle.y, particle.radius + influence * 1.4, 0, Math.PI * 2);
      context.fill();
    });

    for (let index = 0; index < particles.length; index += 1) {
      for (let next = index + 1; next < particles.length; next += 1) {
        const first = particles[index];
        const second = particles[next];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance > 105) continue;
        const pointerDistance = Math.min(Math.hypot(pointer.x - first.x, pointer.y - first.y), Math.hypot(pointer.x - second.x, pointer.y - second.y));
        const alpha = (1 - distance / 105) * (0.025 + Math.max(0, 1 - pointerDistance / 300) * 0.16);
        context.beginPath();
        context.strokeStyle = `rgba(104, 184, 255, ${alpha})`;
        context.lineWidth = 0.65;
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.stroke();
      }
    }

    window.requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    if (orbFrame) return;
    orbFrame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--orb-x', `${pointer.x}px`);
      document.documentElement.style.setProperty('--orb-y', `${pointer.y}px`);
      orbFrame = 0;
    });
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
}

initializeTextEffects();
initializeSpotlights();
initializeBackground();
