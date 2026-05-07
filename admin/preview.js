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

  function onlyText(value) {
    return text(value).replace(/<[^>]*>/g, '');
  }

  var fallbackSite = {
    siteTitle: 'Casa do Dinossauro — Maringá e Londrina',
    logo: '/assets/img/casa-do-dinossauro-6215cc7ecec5.webp',
    description: 'Restaurante temático em Maringá e Londrina com gastronomia, diversão, festas e Mundo Kids para toda a família.',
    whatsappNumber: '554430472200',
    displayPhone: '(44) 3047-2200',
    hours: 'Terça a sexta: 17h às 23h • Sábado e domingo: 11h às 15h e 17h30 às 23h',
    units: [
      { name: 'Casa do Dinossauro Maringá', address: 'Av. Brasil, 2212 — Maringá/PR', phone: '(44) 3047-2200' },
      { name: 'Casa do Dinossauro Londrina', address: 'Av. Maringá, 1330 — Londrina/PR', phone: '(44) 3047-2200' }
    ],
    social: {
      instagram: 'https://www.instagram.com/casadodinossauro/',
      facebook: 'https://www.facebook.com/CasadoDinossauro',
      youtube: 'https://www.youtube.com/@casadodinossauro1567'
    }
  };

  function withFallback(site) {
    site = site || {};
    return Object.assign({}, fallbackSite, site, {
      units: site.units && site.units.length ? site.units : fallbackSite.units,
      social: Object.assign({}, fallbackSite.social, site.social || {})
    });
  }

  function Btn(props) {
    return props.children ? h('span', { className: 'btn ' + (props.type || 'primary') }, props.children) : null;
  }

  function EditLabel(props) {
    return h('span', { className: 'preview-edit-label' }, props.children);
  }

  function SiteHeader(props) {
    var site = withFallback(props.site);
    var nav = ['Início', 'Restaurante', 'Cardápio', 'Festas', 'Mundo Kids', 'Trabalhe Aqui', 'Contato'];
    return h('header', { className: 'site-header preview-site-header' },
      h('a', { className: 'brand', href: '#', 'aria-label': 'Casa do Dinossauro - Início' },
        h('img', { src: norm(site.logo), alt: 'Casa do Dinossauro' })
      ),
      h('nav', { className: 'nav preview-nav' }, nav.map(function (item, i) {
        return h('span', { className: i === 0 ? 'active' : '', key: item }, item);
      })),
      h('span', { className: 'header-cta' }, 'Reservar')
    );
  }

  function UnitCards(props) {
    var site = withFallback(props.site);
    return h('div', { className: 'hero-cards reveal visible' }, site.units.map(function (unit, i) {
      return h('aside', { className: 'hero-card', key: i },
        h('img', { src: norm(site.logo), alt: 'Casa do Dinossauro' }),
        h('strong', null, text(unit.name)),
        h('span', null, text(unit.address)),
        h('span', null, text(unit.phone || site.displayPhone)),
        h('small', null, text(unit.hours || site.hours))
      );
    }));
  }

  function Hero(props) {
    var data = props.data || {};
    var site = withFallback(props.site);
    var hero = data.hero || {};
    var bg = norm(hero.image || '/assets/img/restaurante-tem-tico-7dba715458e7.jpg');
    return h('section', { className: 'hero preview-editable' },
      h(EditLabel, null, 'Topo da página'),
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
        item.image ? h('img', { src: norm(item.image), alt: onlyText(item.title) }) : null,
        h('div', null,
          item.subtitle ? h('span', null, text(item.subtitle)) : null,
          item.title ? h('h3', null, text(item.title)) : null,
          item.text ? h('p', null, text(item.text)) : null,
          item.linkText ? h('div', { className: 'preview-card-action' }, h(Btn, { type: 'primary' }, text(item.linkText))) : null
        )
      );
    }));
  }

  function Split(props) {
    var s = props.section || {};
    var reverse = s.imagePosition === 'left' ? ' reverse' : '';
    var style = s.style === 'dark' ? 'section-dark' : 'section-light';
    return h('section', { className: 'section editable-section preview-editable ' + style },
      h(EditLabel, null, props.label || 'Seção de texto'),
      h('div', { className: 'container split' + reverse },
        h('div', { className: 'section-copy reveal visible' },
          s.kicker ? h('span', { className: 'section-kicker' }, text(s.kicker)) : null,
          s.title ? h('h2', null, text(s.title)) : null,
          s.description ? h('p', null, text(s.description)) : null,
          s.tags && s.tags.length ? h('div', { className: 'tag-list' }, s.tags.map(function (tag, i) { return h('span', { key: i }, text(tag)); })) : null,
          s.buttonText ? h('div', { className: 'hero-actions' }, h(Btn, { type: 'primary' }, text(s.buttonText))) : null
        ),
        s.image ? h('div', { className: 'section-media reveal visible' }, h('img', { src: norm(s.image), alt: onlyText(s.title) })) : h('div', { className: 'preview-empty-media' }, 'Imagem da seção')
      )
    );
  }

  function CardsSection(props) {
    var s = props.section || {};
    var style = s.style === 'dark' ? 'section-dark' : 'section-light';
    return h('section', { className: 'section editable-section preview-editable ' + style },
      h(EditLabel, null, props.label || 'Cards / tópicos'),
      h('div', { className: 'container' },
        h(SectionHead, { section: s }),
        h(Cards, { section: s })
      )
    );
  }

  function Gallery(props) {
    var s = props.section || {};
    var items = s.items || [];
    var style = s.style === 'dark' ? 'section-dark' : 'section-light';
    return h('section', { className: 'section editable-section preview-editable ' + style },
      h(EditLabel, null, props.label || 'Galeria de fotos'),
      h('div', { className: 'container' },
        h(SectionHead, { section: s }),
        h('div', { className: 'gallery-grid' }, items.map(function (item, i) {
          return item.image ? h('img', { key: i, src: norm(item.image), alt: onlyText(item.title), className: 'reveal visible' }) : null;
        }))
      )
    );
  }

  function Cta(props) {
    var s = props.section || {};
    return h('section', { className: 'section section-dark cta-band editable-section preview-editable' },
      h(EditLabel, null, props.label || 'Chamada final'),
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
    var site = withFallback(props.site);
    return h('section', { className: 'section section-light editable-section preview-editable' },
      h(EditLabel, null, props.label || 'Unidades'),
      h('div', { className: 'container' },
        h(SectionHead, { section: s }),
        h('div', { className: 'contact-cards two-cols' }, site.units.map(function (unit, i) {
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
    var site = withFallback(props.site);
    return h('section', { className: 'section section-light editable-section preview-editable' },
      h(EditLabel, null, props.label || 'Contato'),
      h('div', { className: 'container contact-grid' },
        h('div', { className: 'contact-cards reveal visible' },
          h('div', { className: 'contact-card' }, h('span', null, 'WhatsApp'), h('strong', null, text(site.displayPhone)), h('small', null, 'Resposta rápida para reservas, dúvidas e festas nas duas unidades.')),
          h('div', { className: 'contact-card' }, h('span', null, 'Telefone'), h('strong', null, text(site.displayPhone)), h('small', null, 'Ligue para atendimento da Casa do Dinossauro.')),
          site.units.map(function (unit, i) { return h('div', { className: 'contact-card', key: i }, h('span', null, text(unit.name)), h('strong', null, text(unit.address)), h('small', null, text(unit.hours || site.hours))); })
        ),
        h('div', { className: 'modern-form reveal visible' },
          h('span', { className: 'section-kicker' }, text(s.kicker || 'Mensagem')),
          h('h2', null, text(s.title || 'Envie sua solicitação')),
          h('label', null, 'Nome', h('input', { placeholder: 'Seu nome', disabled: true })),
          h('label', null, 'E-mail', h('input', { placeholder: 'seuemail@exemplo.com', disabled: true })),
          h('label', null, 'Telefone', h('input', { placeholder: '(44) 99999-9999', disabled: true })),
          h('label', null, 'Mensagem', h('textarea', { rows: 5, placeholder: 'Escreva sua mensagem', disabled: true })),
          h(Btn, { type: 'primary' }, 'Enviar pelo WhatsApp'),
          h('small', null, 'Este formulário abre uma conversa no WhatsApp com a mensagem pronta.')
        )
      )
    );
  }

  function Work(props) {
    var s = props.section || {};
    var site = withFallback(props.site);
    return h('section', { className: 'section section-light editable-section preview-editable' },
      h(EditLabel, null, props.label || 'Trabalhe Conosco'),
      h('div', { className: 'container form-wrap' },
        h('div', { className: 'modern-form reveal visible' },
          h('span', { className: 'section-kicker' }, text(s.kicker || 'Trabalhe conosco')),
          h('h2', null, text(s.title || 'Envie seus dados')),
          h('label', null, 'Nome completo', h('input', { disabled: true, placeholder: 'Seu nome' })),
          h('label', null, 'Telefone', h('input', { disabled: true, placeholder: '(44) 99999-9999' })),
          h('label', null, 'Cidade', h('select', { disabled: true }, h('option', null, 'Maringá'), h('option', null, 'Londrina'))),
          h('label', null, 'Mensagem', h('textarea', { rows: 5, disabled: true, placeholder: 'Conte um pouco sobre você' })),
          h(Btn, { type: 'primary' }, 'Enviar pelo WhatsApp')
        ),
        h('aside', { className: 'hours-box reveal visible' }, h('h3', null, 'Atendimento'), h('p', null, text(site.hours)), h('p', null, text(site.displayPhone)))
      )
    );
  }

  function Section(props) {
    var s = props.section || {};
    var site = withFallback(props.site);
    var type = s.type || (s.items && s.items.length ? 'cards' : 'split');
    var label = 'Seção ' + (props.index + 1) + ' — ' + ({ split: 'Texto com imagem', cards: 'Cards', gallery: 'Galeria', cta: 'Chamada', units: 'Unidades', contact: 'Contato', work: 'Trabalhe Conosco', menu: 'Cardápio' }[type] || 'Conteúdo');
    if (type === 'split') return h(Split, { section: s, label: label });
    if (type === 'cards' || type === 'menu') return h(CardsSection, { section: s, label: label });
    if (type === 'gallery') return h(Gallery, { section: s, label: label });
    if (type === 'cta') return h(Cta, { section: s, label: label });
    if (type === 'units') return h(Units, { section: s, site: site, label: label });
    if (type === 'contact') return h(Contact, { section: s, site: site, label: label });
    if (type === 'work') return h(Work, { section: s, site: site, label: label });
    return h(Split, { section: s, label: label });
  }

  function SiteFooter(props) {
    var site = withFallback(props.site);
    return h('footer', { className: 'footer' },
      h('div', { className: 'container footer-grid' },
        h('div', null,
          h('img', { className: 'footer-logo', src: norm(site.logo), alt: 'Casa do Dinossauro' }),
          h('p', null, text(site.description))
        ),
        h('div', null,
          h('h3', null, 'Atendimento'),
          h('p', null, text(site.hours)),
          site.units.map(function (unit, i) {
            return h('p', { key: i }, h('strong', null, text(unit.name)), h('br'), text(unit.address), h('br'), text(unit.phone || site.displayPhone));
          })
        ),
        h('div', null,
          h('h3', null, 'Links rápidos'),
          ['Restaurante', 'Cardápio', 'Faça sua festa', 'Mundo Kids', 'Fale Conosco'].map(function (link) { return h('span', { className: 'preview-footer-link', key: link }, link); })
        ),
        h('div', null,
          h('h3', null, 'Siga o Dino'),
          ['Instagram', 'Facebook', 'YouTube'].map(function (link) { return h('span', { className: 'preview-footer-link', key: link }, link); })
        )
      ),
      h('div', { className: 'footer-bottom' }, 'Casa do Dinossauro © 2026 — Todos os direitos reservados.')
    );
  }

  function PreviewChrome(props) {
    return h('div', { className: 'cms-preview' },
      h('div', { className: 'preview-topbar' },
        h('strong', null, 'Pré-visualização do site'),
        h('span', null, 'O que aparece abaixo é uma simulação visual da página pública.')
      ),
      h('div', { className: 'preview-browser' }, props.children)
    );
  }

  function PagePreview(props) {
    var data = toJS(props.entry.getIn(['data']));
    var sections = Array.isArray(data.sections) ? data.sections : [];
    var cta = data.cta && data.cta.title ? [Object.assign({ type: 'cta' }, data.cta)] : [];
    var site = fallbackSite;
    return h(PreviewChrome, null,
      h(SiteHeader, { site: site }),
      h(Hero, { data: data, site: site }),
      sections.map(function (s, i) { return h(Section, { section: s, site: site, key: i, index: i }); }),
      cta.map(function (s, i) { return h(Cta, { section: s, key: 'cta' + i, label: 'Chamada final' }); }),
      h(SiteFooter, { site: site }),
      h('span', { className: 'float-whatsapp preview-whatsapp' }, '☘️ ', h('span', null, 'WhatsApp'))
    );
  }

  function ConfigPreview(props) {
    var data = withFallback(toJS(props.entry.getIn(['data'])));
    return h(PreviewChrome, null,
      h(SiteHeader, { site: data }),
      h('section', { className: 'section section-light preview-config preview-editable' },
        h(EditLabel, null, 'Configurações gerais'),
        h('div', { className: 'container' },
          h('div', { className: 'preview-config-card' },
            h('img', { src: norm(data.logo), alt: 'Casa do Dinossauro' }),
            h('span', { className: 'section-kicker' }, 'Dados do site'),
            h('h1', null, text(data.siteTitle)),
            h('p', null, text(data.description)),
            h('div', { className: 'preview-config-grid' },
              h('div', null, h('strong', null, 'WhatsApp'), h('span', null, text(data.displayPhone || data.whatsappNumber))),
              h('div', null, h('strong', null, 'Horário'), h('span', null, text(data.hours)))
            )
          ),
          h('div', { className: 'contact-cards two-cols preview-config-units' }, data.units.map(function (unit, i) {
            return h('div', { className: 'contact-card', key: i },
              h('span', null, text(unit.name)),
              h('strong', null, text(unit.address)),
              h('small', null, text(unit.phone || data.displayPhone) + ' • ' + text(unit.hours || data.hours))
            );
          }))
        )
      ),
      h(SiteFooter, { site: data })
    );
  }

  CMS.registerPreviewTemplate('paginas', PagePreview);
  CMS.registerPreviewTemplate('configuracoes', ConfigPreview);
})();
