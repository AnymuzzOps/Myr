const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-counter]');
const forms = document.querySelectorAll('[data-form]');

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

const closeMobileMenu = () => {
  navToggle?.setAttribute('aria-expanded', 'false');
  navMenu?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

navMenu?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMobileMenu();
  }
});

window.addEventListener('scroll', setHeaderState, { passive: true });
setHeaderState();

const animateCounter = (counter) => {
  if (counter.dataset.animated === 'true') return;

  counter.dataset.animated = 'true';
  const target = Number(counter.dataset.counter || 0);
  const duration = 1400;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString('es-CL');

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      if (entry.target.hasAttribute('data-counter')) {
        animateCounter(entry.target);
      }

      entry.target.querySelectorAll?.('[data-counter]').forEach(animateCounter);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach((element) => observer.observe(element));
counters.forEach((counter) => observer.observe(counter));

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const status = form.querySelector('[data-form-status]');
    if (status) {
      status.textContent = 'Gracias. Recibimos tu solicitud y te contactaremos pronto.';
    }

    form.reset();
  });
});
