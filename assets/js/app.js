
(() => {
  const init = () => {
    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-nav]');

    window.addEventListener('scroll', () => {
      header?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    toggle?.addEventListener('click', () => {
      const isOpen = nav?.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    });

    nav?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      });
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

  window.initSiteInteractions = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('site-content-loaded', init);
})();
