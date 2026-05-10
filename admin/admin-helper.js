(function () {
  var HELP_STORAGE_KEY = 'casaDinoAdminHelpClosed';

  function closeHelp(help) {
    if (!help) return;
    help.classList.add('is-closing');
    try { window.localStorage.setItem(HELP_STORAGE_KEY, '1'); } catch (e) {}
    setTimeout(function () { if (help.parentNode) help.remove(); }, 220);
  }

  function ready() {
    var loading = document.getElementById('adminLoading');
    if (loading) {
      setTimeout(function () { loading.classList.add('is-hidden'); }, 900);
      setTimeout(function () { if (loading.parentNode) loading.remove(); }, 1400);
    }

    var helpWasClosed = false;
    try { helpWasClosed = window.localStorage.getItem(HELP_STORAGE_KEY) === '1'; } catch (e) {}

    if (!helpWasClosed && !document.querySelector('.admin-floating-help')) {
      var help = document.createElement('div');
      help.className = 'admin-floating-help';
      help.setAttribute('role', 'dialog');
      help.setAttribute('aria-live', 'polite');
      help.innerHTML = [
        '<button class="admin-floating-help__close" type="button" aria-label="Fechar aviso">×</button>',
        '<strong>Casa do Dinossauro</strong>',
        '<span>Edite os campos à esquerda e confira a prévia do site à direita.</span>',
        '<small>Esse aviso é só do painel. Ele não aparece no site público.</small>'
      ].join('');
      document.body.appendChild(help);

      var closeButton = help.querySelector('.admin-floating-help__close');
      if (closeButton) {
        closeButton.addEventListener('click', function () { closeHelp(help); });
      }

      // Fecha sozinho depois de alguns segundos para não atrapalhar a edição.
      setTimeout(function () {
        if (document.body.contains(help) && !help.matches(':hover')) closeHelp(help);
      }, 9000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
