// EVOLUCIÓN CONTROL — panel administrativo de demostración.
// Todo el estado vive en memoria: sin base de datos, sin persistencia, datos ficticios.
(function () {
  'use strict';

  var money = function (n) { return '$' + Number(n).toLocaleString('es-MX'); };
  var now = function () {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  var PRODUCTS = [
    { id: 'p1', name: 'Malteada nutricional', cat: 'Malteadas', price: 55, inv: 'i1' },
    { id: 'p2', name: 'Bebida de aloe', cat: 'Aloe', price: 40, inv: 'i2' },
    { id: 'p3', name: 'Té', cat: 'Tés', price: 30, inv: 'i3' }
  ];
  var MODES = [
    { id: 'directo', label: 'Pago directo', hint: 'Cobro inmediato' },
    { id: 'credito', label: 'Crédito disponible', hint: 'Descuenta del crédito' },
    { id: 'saldo', label: 'Saldo prepagado', hint: 'Descuenta del saldo' },
    { id: 'membresia', label: 'Membresía activa', hint: 'Sin cobro' }
  ];
  var SECTIONS = [
    ['resumen', 'Resumen'], ['socios', 'Socios'], ['pos', 'Punto de venta'], ['tarjetas', 'Tarjetas digitales'],
    ['inventario', 'Inventario'], ['reportes', 'Reportes'], ['seguimiento', 'Seguimiento']
  ];

  function fresh() {
    return {
      section: 'resumen',
      members: [
        { id: 'EV-0001', name: 'Alma Demo', tipo: 'Mensual', visita: 'Hoy', dias: 12, credit: 200, balance: 120, visits: 14, adh: 80 },
        { id: 'EV-0002', name: 'Bruno Demo', tipo: 'Prepago', visita: 'Ayer', dias: 0, credit: 0, balance: 340, visits: 9, adh: 55 },
        { id: 'EV-0003', name: 'Carla Demo', tipo: 'Mensual', visita: 'Hoy', dias: 3, credit: 150, balance: 0, visits: 17, adh: 90 },
        { id: 'EV-0004', name: 'Diego Demo', tipo: 'Crédito', visita: 'Hace 3 días', dias: 0, credit: 400, balance: 0, visits: 6, adh: 40 },
        { id: 'EV-0005', name: 'Elena Demo', tipo: 'Mensual', visita: 'Hoy', dias: 21, credit: 0, balance: 60, visits: 21, adh: 95 },
        { id: 'EV-0006', name: 'Fabián Demo', tipo: 'Prepago', visita: 'Hace 5 días', dias: 0, credit: 100, balance: 80, visits: 4, adh: 35 },
        { id: 'EV-0007', name: 'Gaby Demo', tipo: 'Mensual', visita: 'Ayer', dias: 6, credit: 0, balance: 0, visits: 12, adh: 70 },
        { id: 'EV-0008', name: 'Hugo Demo', tipo: 'Visitante', visita: 'Hace 1 semana', dias: 0, credit: 0, balance: 0, visits: 2, adh: 20 }
      ],
      inventory: [
        { id: 'i1', name: 'Mezcla para malteada', unit: 'porciones', stock: 40, min: 12 },
        { id: 'i2', name: 'Concentrado de aloe', unit: 'porciones', stock: 28, min: 10 },
        { id: 'i3', name: 'Té (sobres)', unit: 'sobres', stock: 60, min: 20 },
        { id: 'i4', name: 'Vasos desechables', unit: 'piezas', stock: 120, min: 40 }
      ],
      sales: [
        { time: '10:05', memberId: 'EV-0001', who: 'Alma Demo', product: 'Té', mode: 'Pago directo', amount: 30 },
        { time: '09:40', memberId: 'EV-0005', who: 'Elena Demo', product: 'Bebida de aloe', mode: 'Saldo prepagado', amount: 40 },
        { time: '09:12', memberId: 'EV-0003', who: 'Carla Demo', product: 'Malteada nutricional', mode: 'Membresía activa', amount: 0 }
      ],
      log: [
        { time: '10:05', text: 'Alma Demo · Té · Pago directo' },
        { time: '09:40', text: 'Elena Demo · Bebida de aloe · Saldo prepagado' },
        { time: '09:12', text: 'Carla Demo · Malteada nutricional · Membresía activa' },
        { time: '09:02', text: 'Visita registrada: Elena Demo' }
      ],
      moves: [
        { time: '08:30', text: 'Entrada ilustrativa · Mezcla para malteada · +20 porciones' },
        { time: '08:30', text: 'Entrada ilustrativa · Vasos desechables · +50 piezas' }
      ],
      visitsToday: 11,
      consumos: 23,
      ingresos: 1240,
      catCounts: { Malteadas: 12, Aloe: 7, 'Tés': 4 },
      posMember: 'EV-0001', posProduct: 'p1', posMode: 'directo', posMsg: '', posOk: true,
      cardMember: 'EV-0001',
      seg: { 'EV-0001': 'Programada', 'EV-0002': 'Pendiente', 'EV-0003': 'Completada', 'EV-0004': 'Pendiente', 'EV-0005': 'Completada', 'EV-0006': 'Pendiente', 'EV-0007': 'Programada', 'EV-0008': 'Pendiente' }
    };
  }

  var S = fresh();

  var PILL_ON = 'background:#1F4B38;color:#FFFFFF;border:1.5px solid #1F4B38';
  var PILL_OFF = 'background:#FFFFFF;color:#1F4B38;border:1.5px solid #B9C2B8';
  var CARD_ON = 'background:#E4EEE6;color:#1F4B38;border:2px solid #1F4B38';
  var CARD_OFF = 'background:#FFFFFF;color:#2A2E2C;border:2px solid #E1DDD0';
  var H1 = 'margin:0;font-family:\'Bricolage Grotesque\',sans-serif;font-size:32px;color:#1F4B38;letter-spacing:-0.02em';
  var CARD = 'background:#FFFFFF;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:14px';
  var SMALLBTN = 'min-height:44px;padding:0 14px;border-radius:999px;background:#FFFFFF;font-weight:700;font-size:14px;cursor:pointer';

  // ---------- acciones ----------
  var acts = {
    section: function (a) { S.section = a; },
    resetAll: function () { S = fresh(); },
    visit: function (id) {
      var m = find(S.members, id);
      m.visita = 'Hoy'; m.visits += 1; S.visitsToday += 1;
      S.log.unshift({ time: now(), text: 'Visita registrada: ' + m.name });
    },
    posMember: function (id) { S.posMember = id; S.posMsg = ''; },
    posProduct: function (id) { S.posProduct = id; S.posMsg = ''; },
    posMode: function (id) { S.posMode = id; S.posMsg = ''; },
    cardMember: function (id) { S.cardMember = id; },
    move: function (a) {
      var p = a.split('|'); var it = find(S.inventory, p[0]); var delta = Number(p[1]);
      if (delta < 0 && it.stock < 5) return;
      it.stock += delta;
      S.moves.unshift({ time: now(), text: (delta > 0 ? 'Entrada ilustrativa' : 'Salida ilustrativa') + ' · ' + it.name + ' · ' + (delta > 0 ? '+' : '−') + '5' });
    },
    seg: function (id) {
      var order = ['Pendiente', 'Programada', 'Completada'];
      S.seg[id] = order[(order.indexOf(S.seg[id]) + 1) % 3];
    },
    register: function () {
      var m = find(S.members, S.posMember), p = find(PRODUCTS, S.posProduct), mode = S.posMode;
      var modeLabel = find(MODES, mode).label;
      var inv = find(S.inventory, p.inv), vasos = find(S.inventory, 'i4');
      var fail = function (t) { S.posMsg = t; S.posOk = false; };
      if (inv.stock < 1) return fail('Sin existencias de ' + inv.name + '. Registra una entrada en Inventario.');
      if (vasos.stock < 1) return fail('Sin vasos disponibles. Registra una entrada en Inventario.');
      if (mode === 'credito' && m.credit < p.price) return fail(m.name + ' no tiene crédito suficiente (' + money(m.credit) + ').');
      if (mode === 'saldo' && m.balance < p.price) return fail(m.name + ' no tiene saldo suficiente (' + money(m.balance) + ').');
      if (mode === 'membresia' && m.dias < 1) return fail(m.name + ' no tiene membresía activa.');
      var charged = mode === 'membresia' ? 0 : p.price;
      var newVisit = m.visita !== 'Hoy';
      var t = now();
      if (mode === 'credito') m.credit -= p.price;
      if (mode === 'saldo') m.balance -= p.price;
      if (mode === 'directo' || mode === 'saldo') S.ingresos += p.price;
      if (newVisit) { m.visits += 1; S.visitsToday += 1; }
      m.visita = 'Hoy';
      inv.stock -= 1; vasos.stock -= 1;
      S.consumos += 1;
      S.catCounts[p.cat] += 1;
      S.sales.unshift({ time: t, memberId: m.id, who: m.name, product: p.name, mode: modeLabel, amount: charged });
      S.log.unshift({ time: t, text: m.name + ' · ' + p.name + ' · ' + modeLabel });
      S.moves.unshift({ time: t, text: 'Salida por consumo · ' + inv.name + ' · −1' });
      S.posMsg = 'Consumo registrado: ' + m.name + ' · ' + p.name + ' · ' + modeLabel + (charged ? ' · ' + money(charged) : ' · sin cobro');
      S.posOk = true;
    }
  };

  function find(list, id) { return list.filter(function (x) { return x.id === id; })[0]; }
  function btn(act, arg, style, label, extra) {
    return '<button type="button" data-act="' + act + '" data-arg="' + (arg == null ? '' : arg) + '" ' + (extra || '') + ' style="' + style + '">' + label + '</button>';
  }
  function bar(label, value, pct, labelW) {
    return '<div style="display:flex;align-items:center;gap:12px"><span style="min-width:' + (labelW || 96) + 'px;font-size:14px">' + label +
      '</span><div style="flex:1;height:14px;background:#EEEBE0;border-radius:7px"><div style="height:14px;border-radius:7px;background:#2F6B4F;width:' + pct + '%"></div></div><strong style="min-width:28px;text-align:right;font-size:14px">' + value + '</strong></div>';
  }
  function listItems(items, textKey) {
    return items.map(function (r) {
      return '<li style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #EEEBE0"><span style="font-size:13px;color:#565C58;min-width:44px">' + r.time + '</span><span>' + r[textKey || 'text'] + '</span></li>';
    }).join('');
  }

  // ---------- vistas ----------
  var views = {
    resumen: function () {
      var expiring = S.members.filter(function (m) { return m.dias > 0 && m.dias <= 7; }).length;
      var stats = [
        ['Socios activos', S.members.filter(function (m) { return m.tipo !== 'Visitante'; }).length, 'de ' + S.members.length + ' registrados'],
        ['Visitas del día', S.visitsToday, 'incluye registros de esta demo'],
        ['Consumos registrados', S.consumos, 'hoy'],
        ['Ingresos demostrativos', money(S.ingresos), 'montos ilustrativos'],
        ['Membresías por vencer', expiring, 'en 7 días o menos']
      ];
      var week = [['Jue', 780], ['Vie', 920], ['Sáb', 1010], ['Dom', 860], ['Lun', 940], ['Mar', 1150], ['Hoy', S.ingresos]];
      var wmax = Math.max.apply(null, week.map(function (w) { return w[1]; }));
      return '<section style="display:flex;flex-direction:column;gap:24px"><h1 style="' + H1 + '">Resumen del día</h1>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:16px">' +
        stats.map(function (s) {
          return '<div style="background:#FFFFFF;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:4px"><span style="font-size:14px;color:#565C58">' + s[0] +
            '</span><strong style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:36px;line-height:1.1;color:#1F4B38">' + s[1] + '</strong><span style="font-size:13px;color:#565C58">' + s[2] + '</span></div>';
        }).join('') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr));gap:16px">' +
        '<div style="' + CARD + '"><h2 style="margin:0;font-size:18px">Ingresos demostrativos · últimos 7 días</h2>' +
        '<div style="display:flex;align-items:flex-end;gap:10px;height:190px">' +
        week.map(function (w) {
          var h = Math.max(8, Math.round(w[1] / wmax * 120));
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;height:100%"><span style="font-size:12px;color:#565C58">' + money(w[1]) +
            '</span><div style="width:100%;max-width:44px;border-radius:6px 6px 0 0;height:' + h + 'px;background:' + (w[0] === 'Hoy' ? '#1F4B38' : '#6E9F82') + '"></div><span style="font-size:12px;font-weight:700">' + w[0] + '</span></div>';
        }).join('') + '</div><span style="font-size:12px;color:#565C58">Montos ilustrativos. La barra oscura es hoy y crece con los cobros que registres.</span></div>' +
        '<div style="' + CARD + '"><h2 style="margin:0;font-size:18px">Movimientos recientes</h2><ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px">' +
        listItems(S.log.slice(0, 6)) + '</ul></div></div></section>';
    },

    socios: function () {
      var cols = 'grid-template-columns:1.3fr 0.9fr 1fr 1fr 1.1fr 1.2fr';
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Socios</h1>' +
        '<div style="background:#FFFFFF;border-radius:20px;padding:8px 20px;overflow-x:auto"><div style="min-width:760px">' +
        '<div style="display:grid;' + cols + ';gap:12px;padding:14px 0;border-bottom:2px solid #E1DDD0;font-size:13px;font-weight:700;color:#565C58;text-transform:uppercase;letter-spacing:0.06em"><span>Nombre</span><span>Identificador</span><span>Membresía</span><span>Última visita</span><span>Vigencia</span><span>Acción</span></div>' +
        S.members.map(function (m) {
          var vence = m.dias > 0 ? (m.dias <= 7 ? 'Vence en ' + m.dias + ' días' : m.dias + ' días restantes') : 'Sin membresía activa';
          var vs = m.dias > 0 && m.dias <= 7 ? 'color:#8A3B1E;font-weight:700' : 'color:#2A2E2C';
          return '<div style="display:grid;' + cols + ';gap:12px;padding:12px 0;border-bottom:1px solid #EEEBE0;align-items:center"><strong>' + m.name + '</strong><span style="color:#565C58">' + m.id + '</span><span>' + m.tipo + '</span><span>' + m.visita + '</span><span style="' + vs + '">' + vence + '</span>' +
            btn('visit', m.id, SMALLBTN + ';border:1.5px solid #1F4B38;color:#1F4B38', 'Registrar visita') + '</div>';
        }).join('') + '</div></div></section>';
    },

    pos: function () {
      var selM = find(S.members, S.posMember), selP = find(PRODUCTS, S.posProduct), selMode = find(MODES, S.posMode);
      var step = function (title, inner) { return '<div style="' + CARD + ';gap:12px"><h2 style="margin:0;font-size:18px">' + title + '</h2>' + inner + '</div>'; };
      var grid = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:12px';
      var cardBtn = 'text-align:left;padding:16px;border-radius:16px;cursor:pointer;display:flex;flex-direction:column;gap:4px;';
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Punto de venta</h1>' +
        step('1 · Selecciona al socio', '<div style="display:flex;flex-wrap:wrap;gap:8px">' + S.members.map(function (m) {
          var on = S.posMember === m.id;
          return btn('posMember', m.id, 'min-height:44px;padding:0 18px;border-radius:999px;font-size:15px;cursor:pointer;' + (on ? PILL_ON : PILL_OFF), m.name, 'aria-pressed="' + on + '"');
        }).join('') + '</div>') +
        step('2 · Consumo de ejemplo', '<div style="' + grid + '">' + PRODUCTS.map(function (p) {
          var on = S.posProduct === p.id;
          return btn('posProduct', p.id, cardBtn + (on ? CARD_ON : CARD_OFF), '<strong style="font-size:16px">' + p.name + '</strong><span style="font-size:14px">' + money(p.price) + ' · existencias: ' + find(S.inventory, p.inv).stock + '</span>', 'aria-pressed="' + on + '"');
        }).join('') + '</div>') +
        step('3 · Modalidad', '<div style="' + grid + '">' + MODES.map(function (md) {
          var on = S.posMode === md.id;
          return btn('posMode', md.id, cardBtn + (on ? CARD_ON : CARD_OFF), '<strong style="font-size:16px">' + md.label + '</strong><span style="font-size:14px">' + md.hint + '</span>', 'aria-pressed="' + on + '"');
        }).join('') + '</div>') +
        '<div style="background:#1F4B38;color:#FFFFFF;border-radius:20px;padding:24px;display:flex;flex-wrap:wrap;gap:16px 32px;align-items:center;justify-content:space-between"><div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:14px;color:#DCE8DD">' +
        selM.name + ' · ' + selP.name + ' · ' + selMode.label + '</span><strong style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:32px">' + (selMode.id === 'membresia' ? 'Sin cobro' : money(selP.price)) + '</strong></div>' +
        btn('register', '', 'min-height:52px;padding:0 32px;border-radius:999px;border:0;background:#C8E65A;color:#1F4B38;font-weight:700;font-size:16px;cursor:pointer', 'Registrar consumo') + '</div>' +
        '<div role="status" id="pos-status">' + (S.posMsg ? '<div style="border-radius:14px;padding:14px 18px;font-weight:700;' + (S.posOk ? 'background:#E4EEE6;color:#1F4B38' : 'background:#F6E3D8;color:#8A3B1E') + '">' + S.posMsg + '</div>' : '') + '</div>' +
        '<p style="margin:0;font-size:13px;color:#565C58">Reglas de la simulación: pago directo y saldo prepagado suman a ingresos; crédito descuenta del crédito disponible; membresía activa registra el consumo sin cobro. Montos ilustrativos, no son precios del club.</p></section>';
    },

    tarjetas: function () {
      var cm = find(S.members, S.cardMember);
      var hist = S.sales.filter(function (x) { return x.memberId === cm.id; }).slice(0, 6);
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Tarjetas digitales</h1><div style="display:flex;flex-wrap:wrap;gap:8px">' +
        S.members.map(function (m) {
          var on = S.cardMember === m.id;
          return btn('cardMember', m.id, 'min-height:44px;padding:0 18px;border-radius:999px;font-size:15px;cursor:pointer;' + (on ? PILL_ON : PILL_OFF), m.name, 'aria-pressed="' + on + '"');
        }).join('') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:16px">' +
        '<div style="background:#1F4B38;color:#FFFFFF;border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:20px;min-height:220px;justify-content:space-between">' +
        '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div style="display:flex;flex-direction:column"><span style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#C8E65A">Pasaporte Evolución · Demo</span><strong style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:28px">' + cm.name + '</strong></div><span style="font-size:14px;color:#DCE8DD">' + cm.id + '</span></div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px">' +
        '<div><span style="font-size:12px;color:#DCE8DD;display:block">Saldo prepagado</span><strong style="font-size:20px">' + money(cm.balance) + '</strong></div>' +
        '<div><span style="font-size:12px;color:#DCE8DD;display:block">Crédito disponible</span><strong style="font-size:20px">' + money(cm.credit) + '</strong></div>' +
        '<div><span style="font-size:12px;color:#DCE8DD;display:block">Membresía</span><strong style="font-size:20px">' + (cm.dias > 0 ? cm.dias + ' días' : 'Sin membresía') + '</strong></div></div></div>' +
        '<div style="' + CARD + ';gap:10px"><h2 style="margin:0;font-size:18px">Historial de consumos</h2>' +
        (hist.length ? '' : '<p style="margin:0;color:#565C58">Sin consumos registrados en esta demostración.</p>') +
        '<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column">' + hist.map(function (h) {
          return '<li style="display:flex;flex-wrap:wrap;gap:4px 12px;padding:10px 0;border-bottom:1px solid #EEEBE0"><span style="font-size:13px;color:#565C58;min-width:44px">' + h.time + '</span><span style="flex:1">' + h.product + ' · ' + h.mode + '</span><strong>' + (h.amount ? money(h.amount) : '—') + '</strong></li>';
        }).join('') + '</ul></div></div></section>';
    },

    inventario: function () {
      var cols = 'grid-template-columns:1.6fr 0.8fr 1.2fr 1.4fr';
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Inventario</h1>' +
        '<div style="background:#FFFFFF;border-radius:20px;padding:8px 20px;overflow-x:auto"><div style="min-width:640px">' +
        '<div style="display:grid;' + cols + ';gap:12px;padding:14px 0;border-bottom:2px solid #E1DDD0;font-size:13px;font-weight:700;color:#565C58;text-transform:uppercase;letter-spacing:0.06em"><span>Artículo</span><span>Existencias</span><span>Estado</span><span>Movimiento</span></div>' +
        S.inventory.map(function (i) {
          var low = i.stock <= i.min;
          return '<div style="display:grid;' + cols + ';gap:12px;padding:12px 0;border-bottom:1px solid #EEEBE0;align-items:center"><strong>' + i.name + '</strong><span>' + i.stock + ' ' + i.unit + '</span>' +
            '<span style="display:inline-block;justify-self:start;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:700;' + (low ? 'background:#F6E3D8;color:#8A3B1E' : 'background:#E4EEE6;color:#1F4B38') + '">' + (low ? 'Existencia baja' : 'Suficiente') + '</span>' +
            '<div style="display:flex;gap:8px">' + btn('move', i.id + '|5', SMALLBTN + ';border:1.5px solid #1F4B38;color:#1F4B38', '+ Entrada') + btn('move', i.id + '|-5', SMALLBTN + ';border:1.5px solid #565C58;color:#2A2E2C', '− Salida') + '</div></div>';
        }).join('') + '</div></div>' +
        '<div style="' + CARD + ';gap:10px"><h2 style="margin:0;font-size:18px">Movimientos ilustrativos</h2><ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column">' + listItems(S.moves.slice(0, 8)) + '</ul></div></section>';
    },

    reportes: function () {
      var sorted = S.members.slice().sort(function (a, b) { return b.visits - a.visits; });
      var vmax = sorted[0].visits;
      var cmax = Math.max.apply(null, Object.keys(S.catCounts).map(function (k) { return S.catCounts[k]; }));
      var rs = [['Ingresos demostrativos', money(S.ingresos)], ['Consumos', S.consumos], ['Visitas del día', S.visitsToday]];
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Reportes</h1>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:16px">' + rs.map(function (s) {
          return '<div style="background:#FFFFFF;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:4px"><span style="font-size:14px;color:#565C58">' + s[0] + '</span><strong style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:32px;line-height:1.1;color:#1F4B38">' + s[1] + '</strong></div>';
        }).join('') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr));gap:16px">' +
        '<div style="' + CARD + '"><h2 style="margin:0;font-size:18px">Visitas frecuentes</h2>' + sorted.map(function (m) { return bar(m.name, m.visits, Math.round(m.visits / vmax * 100)); }).join('') + '</div>' +
        '<div style="' + CARD + '"><h2 style="margin:0;font-size:18px">Consumos por categoría</h2>' + Object.keys(S.catCounts).map(function (k) { return bar(k, S.catCounts[k], Math.round(S.catCounts[k] / cmax * 100)); }).join('') +
        '<p style="margin:8px 0 0;font-size:13px;color:#565C58">Tendencia ilustrativa: los datos se actualizan al registrar consumos en el punto de venta.</p></div></div></section>';
    },

    seguimiento: function () {
      return '<section style="display:flex;flex-direction:column;gap:20px"><h1 style="' + H1 + '">Seguimiento</h1>' +
        '<div style="background:#C8E65A;color:#1F4B38;border-radius:14px;padding:12px 16px;font-size:14px;font-weight:700">Vista ilustrativa de evaluaciones. No almacena ni muestra información clínica real.</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:16px">' + S.members.map(function (m) {
          var st = S.seg[m.id];
          var chip = st === 'Completada' ? 'background:#E4EEE6;color:#1F4B38' : (st === 'Programada' ? 'background:#E2EBC6;color:#3C4A1F' : 'background:#EEEBE0;color:#3F4542');
          return '<div style="background:#FFFFFF;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>' + m.name + '</strong><span style="padding:4px 12px;border-radius:999px;font-size:13px;font-weight:700;' + chip + '">' + st + '</span></div>' +
            '<div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:13px;color:#565C58">Constancia de hábitos (ilustrativa): ' + m.adh + '%</span><div style="height:10px;background:#EEEBE0;border-radius:5px"><div style="height:10px;border-radius:5px;background:#2F6B4F;width:' + m.adh + '%"></div></div></div>' +
            btn('seg', m.id, 'min-height:44px;border-radius:999px;border:1.5px solid #1F4B38;background:#FFFFFF;color:#1F4B38;font-weight:700;font-size:14px;cursor:pointer', 'Cambiar estado') + '</div>';
        }).join('') + '</div></section>';
    }
  };

  // ---------- render ----------
  var navEl = document.getElementById('nav');
  var mainEl = document.getElementById('main');

  function render(focusKey) {
    navEl.innerHTML = SECTIONS.map(function (s) {
      var on = S.section === s[0];
      return btn('section', s[0], 'box-sizing:border-box;width:100%;text-align:left;min-height:44px;padding:0 16px;border-radius:12px;border:0;font-size:15px;cursor:pointer;' +
        (on ? 'background:#1F4B38;color:#FFFFFF;font-weight:700' : 'background:transparent;color:#2A2E2C;font-weight:500'), s[1], 'aria-current="' + (on ? 'page' : 'false') + '"');
    }).join('');
    mainEl.innerHTML = views[S.section]();
    if (focusKey) {
      var t = document.querySelector('[data-act="' + focusKey[0] + '"][data-arg="' + focusKey[1] + '"]');
      if (t) t.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act'), arg = t.getAttribute('data-arg');
    if (!acts[act]) return;
    acts[act](arg);
    render(act === 'resetAll' ? null : [act, arg]);
  });

  render();
})();
