
(() => {
  const page = document.body?.dataset?.page;
  const main = document.querySelector('[data-main]');
  if (!page || !main) return;

  const esc = (value = '') => String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const text = (value = '') => esc(value).replace(/\n/g, '<br>');
  const cleanUrl = (value = '') => String(value || '').trim();
  const image = (value = '') => cleanUrl(value);
  const whatsappUrl = (site, msg='') => {
    const base = `https://wa.me/${site.whatsappNumber || '554430472200'}`;
    return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
  };

  const setText = (selector, value) => {
    if (value === undefined || value === null || value === '') return;
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };
  const setHref = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((el) => { el.href = value; });
  };

  const linkAttrs = (href='') => {
    if (!href) return '';
    const external = /^https?:\/\//.test(href);
    return `href="${esc(href)}"${external ? ' target="_blank" rel="noreferrer"' : ''}`;
  };

  const unitCards = (site) => (site.units || []).map((unit) => `
    <aside class="hero-card">
      <img src="${esc(site.logo || '/assets/uploads/casa-do-dinossauro-6215cc7ecec5.webp')}" alt="Casa do Dinossauro" loading="eager">
      <strong>${text(unit.name)}</strong>
      <span>${text(unit.address)}</span>
      <span>${text(unit.phone || site.displayPhone)}</span>
      <small>${text(unit.hours || site.hours)}</small>
    </aside>
  `).join('');

  const renderHero = (site, data) => {
    const hero = data.hero || {};
    const primaryHref = hero.primaryLink || whatsappUrl(site, 'Olá! Quero fazer uma reserva na Casa do Dinossauro.');
    const secondaryHref = hero.secondaryLink || 'restaurante-maringa.html';
    return `
      <section class="hero">
        <div class="hero-bg" style="background-image: linear-gradient(90deg, rgba(22,14,8,.94), rgba(22,14,8,.68), rgba(22,14,8,.15)), url('${esc(image(hero.image || '/assets/uploads/restaurante-tem-tico-7dba715458e7.jpg'))}');"></div>
        <div class="container hero-grid">
          <div class="hero-copy reveal">
            ${hero.eyebrow ? `<span class="eyebrow">${text(hero.eyebrow)}</span>` : ''}
            <h1>${text(hero.title || site.siteTitle)}</h1>
            ${hero.description ? `<p>${text(hero.description)}</p>` : ''}
            <div class="hero-actions">
              ${hero.primaryText ? `<a class="btn primary" ${linkAttrs(primaryHref)}>${text(hero.primaryText)}</a>` : ''}
              ${hero.secondaryText ? `<a class="btn secondary" ${linkAttrs(secondaryHref)}>${text(hero.secondaryText)}</a>` : ''}
            </div>
          </div>
          <div class="hero-cards reveal">${unitCards(site)}</div>
        </div>
      </section>
    `;
  };

  const renderCards = (section, cardClass='feature-card') => `
    <div class="cards three">
      ${(section.items || []).map((item) => `
        <article class="${cardClass} reveal">
          ${item.image ? `<img src="${esc(image(item.image))}" alt="${esc(item.title || '')}" loading="lazy">` : ''}
          <div>
            ${item.subtitle ? `<span>${text(item.subtitle)}</span>` : ''}
            ${item.title ? `<h3>${text(item.title)}</h3>` : ''}
            ${item.text ? `<p>${text(item.text)}</p>` : ''}
            ${item.linkText ? `<a class="btn primary" style="margin-top:18px" ${linkAttrs(item.linkUrl || '#')}>${text(item.linkText)}</a>` : ''}
          </div>
        </article>
      `).join('')}
    </div>
  `;

  const renderSectionHead = (section) => `
    <div class="section-head reveal">
      <div>
        ${section.kicker ? `<span class="section-kicker">${text(section.kicker)}</span>` : ''}
        ${section.title ? `<h2>${text(section.title)}</h2>` : ''}
      </div>
      ${section.description ? `<p>${text(section.description)}</p>` : ''}
    </div>
  `;

  const renderSplit = (section) => `
    <section class="section editable-section ${section.style === 'dark' ? 'section-dark' : 'section-light'}">
      <div class="container split ${section.imagePosition === 'left' ? 'reverse' : ''}">
        <div class="section-copy reveal">
          ${section.kicker ? `<span class="section-kicker">${text(section.kicker)}</span>` : ''}
          ${section.title ? `<h2>${text(section.title)}</h2>` : ''}
          ${section.description ? `<p>${text(section.description)}</p>` : ''}
          ${Array.isArray(section.tags) && section.tags.length ? `<div class="tag-list">${section.tags.map(t => `<span>${text(t)}</span>`).join('')}</div>` : ''}
          ${section.buttonText ? `<div class="hero-actions"><a class="btn primary" ${linkAttrs(section.buttonLink || '#')}>${text(section.buttonText)}</a></div>` : ''}
        </div>
        ${section.image ? `<div class="section-media reveal"><img src="${esc(image(section.image))}" alt="${esc(section.title || '')}" loading="lazy"></div>` : ''}
      </div>
    </section>
  `;

  const renderCardsSection = (section) => `
    <section class="section editable-section ${section.style === 'dark' ? 'section-dark' : 'section-light'}">
      <div class="container">
        ${renderSectionHead(section)}
        ${renderCards(section)}
      </div>
    </section>
  `;

  const renderGallery = (section) => `
    <section class="section editable-section ${section.style === 'dark' ? 'section-dark' : 'section-light'}">
      <div class="container">
        ${renderSectionHead(section)}
        <div class="gallery-grid">
          ${(section.items || []).map(item => `<img class="reveal" src="${esc(image(item.image))}" alt="${esc(item.title || '')}" loading="lazy">`).join('')}
        </div>
      </div>
    </section>
  `;

  const renderCta = (section, site) => `
    <section class="section section-dark cta-band editable-section">
      <div class="container reveal">
        ${section.kicker ? `<span class="section-kicker">${text(section.kicker)}</span>` : ''}
        ${section.title ? `<h2>${text(section.title)}</h2>` : ''}
        ${section.description ? `<p>${text(section.description)}</p>` : ''}
        ${section.buttonText ? `<a class="btn primary" ${linkAttrs(section.buttonLink || whatsappUrl(site, 'Olá! Quero fazer uma reserva na Casa do Dinossauro.'))}>${text(section.buttonText)}</a>` : ''}
      </div>
    </section>
  `;

  const renderUnits = (section, site) => `
    <section class="section section-light editable-section">
      <div class="container">
        ${renderSectionHead(section)}
        <div class="contact-cards two-cols">
          ${(site.units || []).map(unit => `
            <div class="contact-card reveal"><span>${text(unit.name)}</span><strong>${text(unit.address)}</strong><small>${text(unit.phone || site.displayPhone)}<br>${text(unit.hours || site.hours)}</small></div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  const renderContact = (section, site) => `
    <section class="section section-light editable-section">
      <div class="container contact-grid">
        <div class="contact-cards reveal">
          <a class="contact-card" href="${whatsappUrl(site)}" target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>${text(site.displayPhone)}</strong><small>Resposta rápida para reservas, dúvidas e festas nas duas unidades.</small></a>
          <a class="contact-card" href="tel:+${esc(site.whatsappNumber || '')}"><span>Telefone</span><strong>${text(site.displayPhone)}</strong><small>Ligue para atendimento da Casa do Dinossauro.</small></a>
          ${(site.units || []).map((unit) => `<div class="contact-card"><span>${text(unit.name)}</span><strong>${text(unit.address)}</strong><small>${text(unit.hours || site.hours)}</small></div>`).join('')}
        </div>
        <form class="modern-form reveal" data-whatsapp-form data-form-type="contato">
          <span class="section-kicker">${text(section.kicker || 'Mensagem')}</span>
          <h2>${text(section.title || 'Envie sua solicitação')}</h2>
          <label>Nome<input name="nome" type="text" placeholder="Seu nome" required></label>
          <label>E-mail<input name="email" type="email" placeholder="seuemail@exemplo.com"></label>
          <label>Telefone<input name="telefone" type="tel" placeholder="(44) 99999-9999" required></label>
          <label>Assunto<input name="assunto" type="text" placeholder="Reserva, festa, sugestão..."></label>
          <label>Mensagem<textarea name="mensagem" rows="5" placeholder="Escreva sua mensagem" required></textarea></label>
          <button class="btn primary" type="submit">Enviar pelo WhatsApp</button>
          <small>Este formulário abre uma conversa no WhatsApp com a mensagem pronta.</small>
        </form>
      </div>
    </section>
  `;

  const renderWork = (section, site) => `
    <section class="section section-light editable-section" id="form-trabalho">
      <div class="container form-wrap">
        <form class="modern-form reveal" data-whatsapp-form data-form-type="trabalho">
          <span class="section-kicker">${text(section.kicker || 'Trabalhe conosco')}</span>
          <h2>${text(section.title || 'Envie seus dados')}</h2>
          <label>Nome completo<input name="nome" type="text" placeholder="Seu nome" required></label>
          <label>Telefone<input name="telefone" type="tel" placeholder="(44) 99999-9999" required></label>
          <label>Cidade<select name="cidade"><option>Maringá</option><option>Londrina</option></select></label>
          <label>Área de interesse<input name="area" type="text" placeholder="Atendimento, cozinha, recreação..."></label>
          <label>Mensagem<textarea name="mensagem" rows="5" placeholder="Conte um pouco sobre você"></textarea></label>
          <button class="btn primary" type="submit">Enviar pelo WhatsApp</button>
        </form>
        <aside class="hours-box reveal"><h3>Atendimento</h3><p>${text(site.hours)}</p><p>${text(site.displayPhone)}</p></aside>
      </div>
    </section>
  `;

  const renderSection = (section, site) => {
    const type = section.type || (section.items?.length ? 'cards' : 'split');
    if (type === 'split') return renderSplit(section);
    if (type === 'cards' || type === 'menu') return renderCardsSection(section);
    if (type === 'gallery') return renderGallery(section);
    if (type === 'cta') return renderCta(section, site);
    if (type === 'units') return renderUnits(section, site);
    if (type === 'contact') return renderContact(section, site);
    if (type === 'work') return renderWork(section, site);
    return renderSplit(section);
  };

  const renderFooter = (site) => {
    setText('[data-footer-description]', site.description || '');
    setText('[data-footer-hours]', site.hours || '');
    document.querySelectorAll('[data-site-logo]').forEach((img) => { if (site.logo) img.src = site.logo; });
    const units = document.querySelector('[data-footer-units]');
    if (units) units.innerHTML = (site.units || []).map(unit => `<p><strong>${text(unit.name)}</strong><br>${text(unit.address)}<br>${text(unit.phone || site.displayPhone)}</p>`).join('');
    if (site.social) {
      setHref('[data-social="instagram"]', site.social.instagram);
      setHref('[data-social="facebook"]', site.social.facebook);
      setHref('[data-social="youtube"]', site.social.youtube);
    }
  };

  Promise.all([
    fetch('/content/site.json', { cache: 'no-store' }).then((res) => res.json()),
    fetch(`/content/${page}.json`, { cache: 'no-store' }).then((res) => res.json())
  ]).then(([site, data]) => {
    window.siteWhatsappNumber = site.whatsappNumber || '554430472200';
    document.title = data.titleTag || site.siteTitle || document.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && data.metaDescription) meta.setAttribute('content', data.metaDescription);

    setHref('[data-whatsapp-link]', whatsappUrl(site, 'Olá! Quero fazer uma reserva na Casa do Dinossauro.'));
    setHref('[data-phone-link]', site.whatsappNumber ? `tel:+${site.whatsappNumber}` : '');
    document.querySelectorAll('[data-nav] a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(document.body.dataset.file || '')) a.classList.add('active');
    });

    const sections = Array.isArray(data.sections) ? data.sections : [];
    const cta = data.cta && data.cta.title ? [{ type:'cta', ...data.cta }] : [];
    main.innerHTML = renderHero(site, data) + sections.map(s => renderSection(s, site)).join('') + cta.map(s => renderSection(s, site)).join('');
    renderFooter(site);
    document.dispatchEvent(new CustomEvent('site-content-loaded'));
  }).catch((error) => {
    console.error('Erro ao carregar conteúdo do site:', error);
    main.innerHTML = `<section class="section section-light"><div class="container"><h1>Não foi possível carregar o conteúdo.</h1><p>Se estiver abrindo pelo arquivo no computador, use um servidor local ou publique na Netlify.</p></div></section>`;
  });
})();
