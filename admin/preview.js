(function () {
  if (!window.CMS || !window.React) return;

  var h = window.React.createElement;
  CMS.registerPreviewStyle('/assets/css/style.css');
  CMS.registerPreviewStyle('/admin/preview.css');

  function toJS(value) {
    if (!value) return {};
    return typeof value.toJS === 'function' ? value.toJS() : value;
  }

  function norm(src) {
    if (!src) return '';
    src = String(src).trim();
    if (/^(https?:)?\/\//.test(src) || src.startsWith('data:') || src.startsWith('/')) return src;
    return '/' + src.replace(/^\.\//, '');
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  var fallbackSite = {
    siteTitle: 'Casa do Dinossauro — Maringá e Londrina',
    logo: '/assets/img/casa-do-dinossauro-6215cc7ecec5.webp',
    description: 'Restaurante temático em Maringá e Londrina com gastronomia, diversão, festas e Mundo Kids para toda a família.',
    displayPhone: '(44) 3047-2200',
    hours: 'Terça a sexta: 17h às 23h • Sábado e domingo: 11h às 15h e 17h30 às 23h',
    units: [
      { name: 'Casa do Dinossauro Maringá', address: 'Av. Brasil, 2212 — Maringá/PR', phone: '(44) 3047-2200' },
      { name: 'Casa do Dinossauro Londrina', address: 'Av. Maringá, 1330 — Londrina/PR', phone: '(44) 3047-2200' }
    ]
  };

  function Btn(props) {
    return props.children ? h('span', { className: 'btn ' + (props.type || 'primary') }, props.children) : null;
  }

  function UnitCards(props) {
    var site = props.site || fallbackSite;
    var units = site.units && site.units.length ? site.units : fallbackSite.units;
    return h('div', { className: 'hero-cards reveal visible' }, units.map(function (unit, i) {
      return h('aside', { className: 'hero-card', key: i },
        h('img', { src: norm(site.logo || fallbackSite.logo), alt: 'Casa do Dinossauro' }),
        h('strong', null, text(unit.name)),
        h('span', null, text(unit.address)),
        h('span', null, text(unit.phone || site.displayPhone)),
        h('small', null, text(unit.hours || site.hours))
      );
    }));
  }

  function Hero(props) {
    var data = props.data || {};
    var site = props.site || fallbackSite;
    var hero = data.hero || {};
    var bg = norm(hero.image || '/assets/img/restaurante-tem-tico-7dba715458e7.jpg');
    return h('section', { className: 'hero' },
      h('div', { className: 'hero-bg', style: { backgroundImage: "linear-gradient(90deg, rgba(22,14,8,.94), rgba(22,14,8,.68), rgba(22,14,8,.15)), url('" + bg + "')" } }),
      h('div', { className: 'container hero-grid' },
        h('div', { className: 'hero-copy reveal visible' },
          hero.eyebrow ? h('span', { className: 'eyebrow' }, text(hero.eyebrow)) : null,
          h('h1', null, text(hero.title || site.siteTitle)),
          hero.description ? h('p', null, text(hero.description)) : null,
          h('div', { className: 'hero-actions' },
            hero.primaryText ? h(Btn, { type: 'primary' }, text(hero.primaryText)) : null,
            hero.secondaryText ? h(Btn, { type: 'secondary' }, text(hero.secondaryText)) : null
          )
        ),
        h(UnitCards, { site: site })
      )
    );
  }

  function SectionHead(props) {
    var s = props.section || {};
    return h('div', { className: 'section-head reveal visible' },
      h('div', null,
        s.kicker ? h('span', { className: 'section-kicker' }, text(s.kicker)) : null,
        s.title ? h('h2', null, text(s.title)) : null
      ),
      s.description ? h('p', null, text(s.description)) : null
    );
  }

  function Cards(props) {
    var items = (props.section && props.section.items) || [];
    return h('div', { className: 'cards three' }, items.map(function (item, i) {
      return h('article', { className: 'feature-card reveal visible', key: i },
        item.image ? h('img', { src: norm(item.image), alt: text(item.title) }) : null,
        h('div', null,
          item.subtitle ? h('span', null, text(item.subtitle)) : null,
          item.title ? h('h3', null, text(item.title)) : null,
          item.text ? h('p', null, text(item.text)) : null,
          item.linkText ? h(Btn, { type: 'primary' }, text(item.linkText)) : null
        )
      );
    }));
  }

  function Split(props) {
    var s = props.section || {};
    var reverse = s.imagePosition === 'left' ? ' reverse' : '';
    return h('section', { className: 'section editable-section ' + (s.style === 'dark' ? 'section-dark' : 'section-light') },
      h('div', { className: 'container split' + reverse },
        h('div', { className: 'section-copy reveal visible' },
          s.kicker ? h('span', { className: 'section-kicker' }, text(s.kicker)) : null,
          s.title ? h('h2', null, text(s.title)) : null,
          s.description ? h('p', null, text(s.description)) : null,
          s.tags && s.tags.length ? h('div', { className: 'tag-list' }, s.tags.map(function (tag, i) { return h('span', { key: i }, text(tag)); })) : null,
          s.buttonText ? h('div', { className: 'hero-actions' }, h(Btn, { type: 'primary' }, text(s.buttonText))) : null
        ),
        s.image ? h('div', { className: 'section-media reveal visible' }, h('img', { src: norm(s.image), alt: text(s.title) })) : null
      )
    );
  }

  function Gallery(props) {
    var s = props.section || {};
    var items = s.items || [];
    return h('section', { className: 'section editable-section ' + (s.style === 'dark' ? 'section-dark' : 'section-light') },
      h('div', { className: 'container' },
        h(SectionHead, { section: s }),
        h('div', { className: 'gallery-grid' }, items.map(function (item, i) { return item.image ? h('img', { key: i, src: norm(item.image), alt: text(item.title), className: 'reveal visible' }) : null; }))
      )
    );
  }

  function Cta(props) {
    var s = props.section || {};
    return h('section', { className: 'section section-dark cta-band editable-section' },
      h('div', { className: 'container reveal visible' },
        s.kicker ? h('span', { className: 'section-kicker' }, text(s.kicker)) : null,
        s.title ? h('h2', null, text(s.title)) : null,
        s.description ? h('p', null, text(s.description)) : null,
        s.buttonText ? h(Btn, { type: 'primary' }, text(s.buttonText)) : null
      )
    );
  }

  function Units(props) {
    var s = props.section || {};
    var site = props.site || fallbackSite;
    var units = site.units && site.units.length ? site.units : fallbackSite.units;
    return h('section', { className: 'section section-light editable-section' },
      h('div', { className: 'container' },
        h(SectionHead, { section: s }),
        h('div', { className: 'contact-cards two-cols' }, units.map(function (unit, i) {
          return h('div', { className: 'contact-card reveal visible', key: i },
            h('span', null, text(unit.name)),
            h('strong', null, text(unit.address)),
            h('small', null, text(unit.phone || site.displayPhone) + ' • ' + text(unit.hours || site.hours))
          );
        }))
      )
    );
  }

  function Contact(props) {
    var s = props.section || {};
    var site = props.site || fallbackSite;
    return h('section', { className: 'section section-light editable-section' },
      h('div', { className: 'container contact-grid' },
        h('div', { className: 'contact-cards reveal visible' },
          h('div', { className: 'contact-card' }, h('span', null, 'WhatsApp'), h('strong', null, text(site.displayPhone)), h('small', null, 'Resposta rápida para reservas, dúvidas e festas nas duas unidades.')),
          (site.units || fallbackSite.units).map(function (unit, i) { return h('div', { className: 'contact-card', key: i }, h('span', null, text(unit.name)), h('strong', null, text(unit.address)), h('small', null, text(unit.hours || site.hours))); })
        ),
        h('div', { className: 'modern-form reveal visible' },
          h('span', { className: 'section-kicker' }, text(s.kicker || 'Mensagem')),
          h('h2', null, text(s.title || 'Envie sua solicitação')),
          h('label', null, 'Nome', h('input', { placeholder: 'Seu nome', disabled: true })),
          h('label', null, 'Mensagem', h('textarea', { rows: 5, placeholder: 'Escreva sua mensagem', disabled: true })),
          h(Btn, { type: 'primary' }, 'Enviar pelo WhatsApp')
        )
      )
    );
  }

  function Work(props) {
    var s = props.section || {};
    var site = props.site || fallbackSite;
    return h('section', { className: 'section section-light editable-section' },
      h('div', { className: 'container form-wrap' },
        h('div', { className: 'modern-form reveal visible' },
          h('span', { className: 'section-kicker' }, text(s.kicker || 'Trabalhe conosco')),
          h('h2', null, text(s.title || 'Envie seus dados')),
          h('label', null, 'Nome completo', h('input', { disabled: true, placeholder: 'Seu nome' })),
          h('label', null, 'Área de interesse', h('input', { disabled: true, placeholder: 'Atendimento, cozinha, recreação...' })),
          h(Btn, { type: 'primary' }, 'Enviar pelo WhatsApp')
        ),
        h('aside', { className: 'hours-box reveal visible' }, h('h3', null, 'Atendimento'), h('p', null, text(site.hours)), h('p', null, text(site.displayPhone)))
      )
    );
  }

  function Section(props) {
    var s = props.section || {};
    var site = props.site || fallbackSite;
    var type = s.type || (s.items && s.items.length ? 'cards' : 'split');
    if (type === 'split') return h(Split, { section: s });
    if (type === 'cards' || type === 'menu') return h('section', { className: 'section editable-section ' + (s.style === 'dark' ? 'section-dark' : 'section-light') }, h('div', { className: 'container' }, h(SectionHead, { section: s }), h(Cards, { section: s })));
    if (type === 'gallery') return h(Gallery, { section: s });
    if (type === 'cta') return h(Cta, { section: s });
    if (type === 'units') return h(Units, { section: s, site: site });
    if (type === 'contact') return h(Contact, { section: s, site: site });
    if (type === 'work') return h(Work, { section: s, site: site });
    return h(Split, { section: s });
  }

  function Header(props) {
    var site = props.site || fallbackSite;
    return h('div', { className: 'preview-header' },
      h('img', { className: 'preview-logo', src: norm(site.logo || fallbackSite.logo), alt: 'Casa do Dinossauro' }),
      h('div', { className: 'preview-nav' }, ['Início', 'Restaurante', 'Cardápio', 'Festas', 'Mundo Kids', 'Trabalhe Aqui', 'Contato'].map(function (item, i) { return h('span', { key: i }, item); })),
      h('span', { className: 'preview-btn' }, 'Reservar')
    );
  }

  function PagePreview(props) {
    var data = toJS(props.entry.getIn(['data']));
    var sections = Array.isArray(data.sections) ? data.sections : [];
    var cta = data.cta && data.cta.title ? [{ type: 'cta' }].map(function (x) { return Object.assign(x, data.cta); }) : [];
    return h('div', { className: 'cms-preview' },
      h('div', { className: 'preview-shell' },
        h(Header, { site: fallbackSite }),
        h(Hero, { data: data, site: fallbackSite }),
        sections.map(function (s, i) { return h(Section, { section: s, site: fallbackSite, key: i }); }),
        cta.map(function (s, i) { return h(Section, { section: s, site: fallbackSite, key: 'cta' + i }); }),
        h('div', { className: 'footer-bottom' }, 'Pré-visualização do painel — aparência aproximada do site'),
        h('div', { className: 'preview-note' }, 'Prévia visual')
      )
    );
  }

  function ConfigPreview(props) {
    var data = toJS(props.entry.getIn(['data']));
    var units = data.units && data.units.length ? data.units : [];
    return h('div', { className: 'cms-preview' },
      h(Header, { site: data }),
      h('div', { className: 'preview-config' },
        h('div', { className: 'preview-config-card' },
          h('img', { src: norm(data.logo || fallbackSite.logo), alt: 'Casa do Dinossauro', style: { width: 150, marginBottom: 18 } }),
          h('h1', null, text(data.siteTitle || 'Configurações gerais')),
          h('p', null, text(data.description || '')),
          h('p', null, h('strong', null, 'WhatsApp: '), text(data.displayPhone || data.whatsappNumber || '')),
          h('p', null, h('strong', null, 'Horário: '), text(data.hours || '')),
          h('div', { className: 'preview-units' }, units.map(function (unit, i) {
            return h('div', { className: 'preview-unit', key: i }, h('strong', null, text(unit.name)), h('p', null, text(unit.address)), h('small', null, text(unit.phone || data.displayPhone)));
          }))
        )
      )
    );
  }

  CMS.registerPreviewTemplate('paginas', PagePreview);
  CMS.registerPreviewTemplate('configuracoes', ConfigPreview);
})();
