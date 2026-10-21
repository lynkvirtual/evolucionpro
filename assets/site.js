// Sitio público: menú "Explorar plataforma" y formulario de registro simulado.
// No se guarda ni se envía ningún dato.
(function () {
  var btn = document.getElementById('explore-btn');
  var menu = document.getElementById('explore-menu');
  btn.addEventListener('click', function () {
    var open = menu.hasAttribute('hidden');
    if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hasAttribute('hidden')) {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  var form = document.getElementById('form-box');
  var sent = document.getElementById('sent-box');
  document.getElementById('submit-btn').addEventListener('click', function () {
    form.setAttribute('hidden', '');
    sent.removeAttribute('hidden');
  });
  document.getElementById('again-btn').addEventListener('click', function () {
    ['f-nombre', 'f-tel'].forEach(function (id) { document.getElementById(id).value = ''; });
    sent.setAttribute('hidden', '');
    form.removeAttribute('hidden');
  });
})();
