(() => {
  const page = document.body?.dataset?.page;
  if (!page) return;

  const get = (obj, path) => path.split('.').reduce((acc, key) => acc && acc[key], obj);
  const setText = (selector, value) => {
    if (value === undefined || value === null || value === '') return;
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };
  const setHref = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((el) => { el.href = value; });
  };

  const renderUnits = (site) => {
    const wrappers = document.querySelectorAll('[data-units]');
    if (!wrappers.length || !Array.isArray(site.units)) return;
    wrappers.forEach((wrapper) => {
      wrapper.innerHTML = site.units.map((unit) => `
        <aside class="hero-card">
          <img src="assets/img/casa-do-dinossauro-6215cc7ecec5.webp" alt="Casa do Dinossauro" loading="eager">
          <strong>${unit.name || ''}</strong>
          <span>${unit.address || ''}</span>
          <span>${unit.phone || site.displayPhone || ''}</span>
          <small>${unit.hours || site.hours || ''}</small>
        </aside>
      `).join('');
    });
  };

  const renderContactCards = (site) => {
    const wrapper = document.querySelector('[data-contact-cards]');
    if (!wrapper || !Array.isArray(site.units)) return;
    const whatsapp = `https://wa.me/${site.whatsappNumber || ''}`;
    wrapper.innerHTML = `
      <a class="contact-card" href="${whatsapp}" target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>${site.displayPhone || ''}</strong><small>Resposta rápida para reservas, dúvidas e festas nas duas unidades.</small></a>
      <a class="contact-card" href="tel:+${site.whatsappNumber || ''}"><span>Telefone</span><strong>${site.displayPhone || ''}</strong><small>Ligue para atendimento da Casa do Dinossauro.</small></a>
      ${site.units.map((unit) => `<div class="contact-card"><span>${unit.name || ''}</span><strong>${unit.address || ''}</strong><small>${unit.hours || site.hours || ''}</small></div>`).join('')}
    `;
  };

  Promise.all([
    fetch('content/site.json').then((res) => res.json()),
    fetch(`content/${page}.json`).then((res) => res.json())
  ]).then(([site, data]) => {
    document.title = data.titleTag || site.siteTitle || document.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && data.metaDescription) meta.setAttribute('content', data.metaDescription);

    setText('[data-content="hero.eyebrow"]', get(data, 'hero.eyebrow'));
    setText('[data-content="hero.title"]', get(data, 'hero.title'));
    setText('[data-content="hero.description"]', get(data, 'hero.description'));
    setText('[data-content="hero.primaryText"]', get(data, 'hero.primaryText'));
    setText('[data-content="hero.secondaryText"]', get(data, 'hero.secondaryText'));
    setText('[data-content="cta.title"]', get(data, 'cta.title'));
    setText('[data-content="cta.description"]', get(data, 'cta.description'));
    setText('[data-content="cta.button"]', get(data, 'cta.button'));
    setText('[data-content="site.description"]', site.description);
    setText('[data-content="site.hours"]', site.hours);
    setText('[data-content="site.phone"]', site.displayPhone);

    const heroImage = get(data, 'hero.image');
    document.querySelectorAll('[data-content-bg="hero.image"]').forEach((el) => {
      if (heroImage) el.style.backgroundImage = `linear-gradient(90deg, rgba(22,14,8,.94), rgba(22,14,8,.68), rgba(22,14,8,.15)), url('${heroImage}')`;
    });

    const whatsapp = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}` : '';
    setHref('[data-whatsapp-link]', whatsapp);
    setHref('[data-phone-link]', site.whatsappNumber ? `tel:+${site.whatsappNumber}` : '');
    renderUnits(site);
    renderContactCards(site);
  }).catch(() => {
    // Mantém o conteúdo estático caso o navegador bloqueie fetch local.
  });
})();
