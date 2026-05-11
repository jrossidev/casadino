
(() => {
  const closeMenu = () => {
    const nav = document.querySelector('[data-nav]');
    const toggle = document.querySelector('[data-menu-toggle]');
    nav?.classList.remove('open', 'is-open');
    toggle?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    const nav = document.querySelector('[data-nav]');
    const toggle = document.querySelector('[data-menu-toggle]');
    nav?.classList.add('open', 'is-open');
    toggle?.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  const toggleMenu = () => {
    const nav = document.querySelector('[data-nav]');
    const isOpen = nav?.classList.contains('open') || nav?.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  };

  const init = () => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-menu-toggle]');

    window.addEventListener('scroll', () => {
      header?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    if (toggle && !toggle.dataset.menuReady) {
      toggle.dataset.menuReady = 'true';
      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
      });
    }

    document.querySelectorAll('[data-nav] a:not([data-close-ready])').forEach(link => {
      link.dataset.closeReady = 'true';
      link.addEventListener('click', closeMenu);
    });

    const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 }) : null;

    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('visible');
    });

    document.querySelectorAll('[data-whatsapp-form]:not([data-form-ready])').forEach(form => {
      form.dataset.formReady = 'true';
      form.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(form);
        const entries = [...data.entries()].filter(([, value]) => String(value).trim());
        const number = window.siteWhatsappNumber || '554430472200';
        const type = form.dataset.formType;
        const title = type === 'trabalho'
          ? 'Olá! Quero enviar meu interesse para trabalhar na Casa do Dinossauro.'
          : 'Olá! Quero falar com a Casa do Dinossauro.';
        const message = [title, '', ...entries.map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)].join('\n');
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
      });
    });
  };

  document.addEventListener('click', (event) => {
    const clickedMenuButton = event.target.closest?.('[data-menu-toggle]');
    const clickedNav = event.target.closest?.('[data-nav]');
    if (!clickedMenuButton && !clickedNav) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  window.initSiteInteractions = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('site-content-loaded', init);
})();
