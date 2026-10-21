// MI EVOLUCIÓN — portal del socio de demostración. Datos ficticios, estado solo en memoria.
(function () {
  'use strict';

  var done = { hid: true, ali: true, act: false, des: false };
  var joined = { r1: false, r2: false, r3: false };

  var HABITS = [
    { id: 'hid', label: 'Hidratación', hint: 'Toma agua a lo largo del día' },
    { id: 'ali', label: 'Alimentación', hint: 'Sigue tu plan de comidas' },
    { id: 'act', label: 'Actividad física', hint: 'Muévete un rato hoy' },
    { id: 'des', label: 'Descanso', hint: 'Cuida tu hora de dormir' }
  ];
  var RETOS = [
    { id: 'r1', title: 'Semana de hidratación', desc: 'Un reto general para tomar agua con constancia.' },
    { id: 'r2', title: 'Reto de constancia', desc: 'Registra tus hábitos varios días seguidos.' },
    { id: 'r3', title: 'Actividad en comunidad', desc: 'Una actividad grupal de bienestar.' }
  ];
  var ADHERENCE = [['Hidratación', 82], ['Alimentación', 74], ['Actividad física', 58], ['Descanso', 66]];

  // QR demostrativo: patrón determinista, sin datos ni función de acceso.
  function qrHtml() {
    var n = 15, seed = 20261022, grid = [], i, x, y, k;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    for (i = 0; i < n * n; i++) grid.push(rnd() > 0.52);
    function finder(ox, oy) {
      for (y = 0; y < 5; y++) for (x = 0; x < 5; x++) {
        var edge = x === 0 || y === 0 || x === 4 || y === 4, core = x === 2 && y === 2;
        grid[(oy + y) * n + ox + x] = edge || core;
      }
      for (k = 0; k < 6; k++) {
        var px = ox === 0 ? 5 : ox - 1, py = oy === 0 ? 5 : oy - 1;
        if (oy + k < n) grid[(oy + k) * n + px] = false;
        if (ox + k < n) grid[py * n + ox + k] = false;
      }
    }
    finder(0, 0); finder(10, 0); finder(0, 10);
    return grid.map(function (on) { return '<div style="width:10px;height:10px;background:' + (on ? '#1F4B38' : '#FFFFFF') + '"></div>'; }).join('');
  }

  function doneCount() { return HABITS.filter(function (h) { return done[h.id]; }).length; }

  function render(focus) {
    var dc = doneCount();
    Array.prototype.forEach.call(document.querySelectorAll('.done-count'), function (el) { el.textContent = dc; });

    document.getElementById('habits').innerHTML = HABITS.map(function (h) {
      var on = done[h.id];
      return '<button type="button" data-kind="habit" data-id="' + h.id + '" aria-pressed="' + on + '" style="display:flex;align-items:center;gap:14px;min-height:64px;padding:12px 16px;border-radius:16px;text-align:left;cursor:pointer;font-size:16px;' +
        (on ? 'background:#E4EEE6;border:2px solid #1F4B38;color:#1F4B38' : 'background:#FFFFFF;border:2px solid #D9D4C5;color:#2A2E2C') + '">' +
        '<span aria-hidden="true" style="flex:none;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;' +
        (on ? 'background:#1F4B38;color:#FFFFFF' : 'background:#FFFFFF;border:2px solid #8A918C;color:#FFFFFF') + '">' + (on ? '✓' : '') + '</span>' +
        '<span style="display:flex;flex-direction:column"><strong>' + h.label + '</strong><span style="font-size:14px;opacity:.85">' + h.hint + '</span></span></button>';
    }).join('');

    var week = [['Jue', 3], ['Vie', 4], ['Sáb', 2], ['Dom', 4], ['Lun', 3], ['Mar', 4], ['Hoy', dc]];
    document.getElementById('week').innerHTML = week.map(function (d) {
      return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;height:100%"><span style="font-size:12px;color:#565C58">' + d[1] + '/4</span>' +
        '<div style="width:100%;max-width:36px;border-radius:6px 6px 0 0;height:' + Math.max(6, d[1] * 28) + 'px;background:' + (d[0] === 'Hoy' ? '#1F4B38' : '#6E9F82') + '"></div><span style="font-size:12px;font-weight:700">' + d[0] + '</span></div>';
    }).join('');

    document.getElementById('adherence').innerHTML = ADHERENCE.map(function (a) {
      return '<div style="display:flex;align-items:center;gap:12px"><span style="min-width:110px;font-size:14px">' + a[0] + '</span><div style="flex:1;height:14px;background:#EEEBE0;border-radius:7px"><div style="height:14px;border-radius:7px;background:#2F6B4F;width:' + a[1] + '%"></div></div><strong style="min-width:40px;text-align:right;font-size:14px">' + a[1] + '%</strong></div>';
    }).join('');

    document.getElementById('retos').innerHTML = RETOS.map(function (r) {
      var on = joined[r.id];
      return '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:16px;border-radius:16px;background:#FAF8F2;width:100%;box-sizing:border-box"><div style="display:flex;flex-direction:column;flex:1 1 200px"><strong>' + r.title + '</strong><span style="font-size:14px;color:#565C58">' + r.desc + '</span></div>' +
        '<button type="button" data-kind="reto" data-id="' + r.id + '" aria-pressed="' + on + '" style="min-height:44px;padding:0 20px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;' +
        (on ? 'background:#1F4B38;color:#FFFFFF;border:1.5px solid #1F4B38' : 'background:#FFFFFF;color:#1F4B38;border:1.5px solid #1F4B38') + '">' + (on ? 'Me interesa ✓' : 'Me interesa') + '</button></div>';
    }).join('');

    if (focus) {
      var t = document.querySelector('[data-kind="' + focus[0] + '"][data-id="' + focus[1] + '"]');
      if (t) t.focus({ preventScroll: true });
    }
  }

  document.getElementById('qr').innerHTML = qrHtml();

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kind]');
    if (!t) return;
    var kind = t.getAttribute('data-kind'), id = t.getAttribute('data-id');
    if (kind === 'habit') done[id] = !done[id];
    if (kind === 'reto') joined[id] = !joined[id];
    render([kind, id]);
  });

  render();
})();
