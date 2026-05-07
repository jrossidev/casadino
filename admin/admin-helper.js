(function () {
  function ready() {
    var loading = document.getElementById('adminLoading');
    if (loading) {
      setTimeout(function () { loading.classList.add('is-hidden'); }, 900);
      setTimeout(function () { loading.remove(); }, 1400);
    }

    if (!document.querySelector('.admin-floating-help')) {
      var help = document.createElement('div');
      help.className = 'admin-floating-help';
      help.innerHTML = '<strong>Casa do Dinossauro</strong><span>Edite à esquerda e confira a prévia à direita.</span>';
      document.body.appendChild(help);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
