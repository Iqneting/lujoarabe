/* IQ Commerce POS — puente LOCAL de demostración V41.
 * Misma procedencia (localhost/HTTPS) y localStorage; NO sustituye una API,
 * BD ni transacciones seguras multiusuario.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.IQLocalDemo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const KEY = 'iqcommerce_maestro_fiel_v1';
  const num = (v) => Number(v);
  const validQty = (v) => Number.isSafeInteger(num(v)) && num(v) >= 1 && num(v) <= 999;
  const money = (v) => Math.round((num(v) + Number.EPSILON) * 100) / 100;
  const norm = (v) => String(v || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const fail = (code) => { const e = new Error(code); e.code = code; throw e; };
  const sessionStore = (storage) => storage || (typeof localStorage !== 'undefined' ? localStorage : null);

  function read(storage) {
    const store = sessionStore(storage);
    if (!store) return null;
    try {
      const d = JSON.parse(store.getItem(KEY) || 'null');
      return d && Array.isArray(d.products) && Array.isArray(d.orders) &&
        Array.isArray(d.categories) ? d : null;
    } catch (_) { return null; }
  }
  function write(db, storage) {
    const store = sessionStore(storage);
    if (!store) fail('storage_unavailable');
    try { store.setItem(KEY, JSON.stringify(db)); }
    catch (_) { fail('storage_unavailable'); }
    return db;
  }
  function numericId(value) {
    const raw = String(value || '');
    const standard = /^P-0*([1-9][0-9]*)$/.exec(raw);
    if (standard) return num(standard[1]);
    let hash = 2166136261;
    for (const c of raw) { hash ^= c.charCodeAt(0); hash = Math.imul(hash, 16777619) >>> 0; }
    return hash + 1000000;
  }
  function available(product) {
    return Math.max(0, Math.max(0, num(product.stock) || 0) - Math.max(0, num(product.reserved) || 0));
  }
  function catalog(seed, storage) {
    const db = read(storage);
    if (!db) return Array.isArray(seed) ? seed.slice() : [];
    const templates = Array.isArray(seed) ? seed : [];
    const unique = new Set();
    return db.products.filter(p => p.active !== false && p.archived !== true).map(p => {
      const id = numericId(p.id);
      if (unique.has(id)) fail('catalog_id_collision');
      unique.add(id);
      const tpl = templates.find(x => norm(x.nombre) === norm(p.name)) || templates[0] || {};
      return {
        ...tpl, id, __panelId: p.id,
        nombre: String(p.name || 'Producto'), marca: String(p.brand || ''),
        presentacion: String(p.presentacion || tpl.presentacion || 'Producto'),
        tipo: String(p.tipo || tpl.tipo || 'Producto'),
        genero: String(p.genero || tpl.genero || 'unisex'),
        categoria: String(p.publicCategory || tpl.categoria || 'arabes'),
        notas: String(p.desc || tpl.notas || 'Producto del catálogo'),
        precio: money(p.price), foto: p.images?.[0] || tpl.foto || '',
        badge: p.featured ? 'Destacado' : '',
        disponible: available(p)
      };
    });
  }
  function nextId(db) {
    let id;
    do {
      const rand = typeof crypto !== 'undefined' && crypto.getRandomValues
        ? [...crypto.getRandomValues(new Uint32Array(2))].map(n => n.toString(36)).join('')
        : (Date.now().toString(36) + Math.random().toString(36).slice(2));
      id = 'LA-LOCAL-' + rand.toUpperCase();
    } while (db.orders.some(o => o.id === id));
    return id;
  }
  // Mutación síncrona de una única clave; NO es una transacción entre pestañas.
  function checkout(intent, storage) {
    const db = read(storage);
    if (!db) fail('panel_not_initialized');
    if (!intent || !Array.isArray(intent.items) || !intent.items.length || intent.items.length > 100)
      fail('empty_cart');
    const customer = String(intent.customer?.name || '').trim();
    const email = String(intent.customer?.email || '').trim();
    if (!customer || customer.length > 160 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('invalid_customer');
    const method = String(intent.shippingMethod || '');
    const charges = {estandar: 99, express: 149, recoger: 0};
    if (!Object.prototype.hasOwnProperty.call(charges, method)) fail('invalid_shipping');
    const rate = num(db.tax?.ivaRate ?? 16);
    if (db.tax?.ivaEnabled === true && !['included', 'added'].includes(db.tax?.priceMode))
      fail('iva_pricing_mode_required');
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) fail('invalid_iva');
    const index = new Map(db.products.map(p => [p.id, p]));
    const units = new Map();
    for (const row of intent.items) {
      if (!row || typeof row.panelId !== 'string' || !validQty(row.qty)) fail('invalid_item');
      const p = index.get(row.panelId);
      if (!p || p.active === false) fail('product_unavailable');
      if (!Number.isFinite(num(p.price)) || num(p.price) < 0) fail('invalid_price');
      units.set(p.id, (units.get(p.id) || 0) + num(row.qty));
      if (units.get(p.id) > 999 || units.get(p.id) > available(p)) fail('insufficient_stock');
    }
    const items = [];
    let subtotal = 0, tax = 0;
    for (const [productId, qty] of units) {
      const p = index.get(productId), unitPrice = money(p.price);
      const base = money(unitPrice * qty);
      const lineTax = db.tax?.ivaEnabled === true
        ? (db.tax.priceMode === 'added' ? money(base * rate / 100) : money(base - base / (1 + rate / 100)))
        : 0;
      items.push({
        productId, name: p.name, qty, unitPrice,
        lineSubtotal: base, taxRate: db.tax?.ivaEnabled === true ? rate : 0,
        taxTotal: lineTax, lineTotal: money(base + (db.tax?.priceMode === 'added' ? lineTax : 0))
      });
      subtotal = money(subtotal + base);
      tax = money(tax + lineTax);
    }
    const shippingTotal = charges[method];
    const total = money(subtotal + shippingTotal +
      (db.tax?.ivaEnabled === true && db.tax?.priceMode === 'added' ? tax : 0));
    const now = new Date().toISOString();
    const order = {
      id: nextId(db), customer, customerEmail: email,
      customerPhone: String(intent.customer?.phone || '').trim(),
      shipping: { ...intent.shipping }, shippingMethod: method,
      total, subtotal, shippingTotal, taxTotal: tax,
      ivaRate: db.tax?.ivaEnabled === true ? rate : 0,
      ivaMode: db.tax?.ivaEnabled === true ? db.tax.priceMode : 'disabled',
      status: 'pending', payment: 'pending', source: 'storefront-local',
      reservationState: 'held', date: now, items,
      voucher: '', carrier: '', tracking: ''
    };
    // Only modify the in-memory copy after every item has passed validation.
    for (const [pid, qty] of units) {
      const p = index.get(pid);
      p.reserved = Math.max(0, num(p.reserved) || 0) + qty;
    }
    db.orders.unshift(order);
    if (!Array.isArray(db.activity)) db.activity = [];
    db.activity.unshift({date: now, text: 'Pedido de tienda reservado (demo): ' + order.id});
    write(db, storage);
    return {order, db};
  }
  function approvePayment(orderId, storage) {
    const db = read(storage);
    if (!db) fail('panel_not_initialized');
    const order = db.orders.find(o => o.id === orderId);
    if (!order) fail('order_not_found');
    if (order.status !== 'review' || order.payment !== 'review' || !order.voucher)
      fail('payment_not_in_review');
    if (order.reservationState === 'held') {
      for (const line of order.items) {
        const p = db.products.find(x => x.id === line.productId);
        if (!p || !validQty(line.qty) ||
          num(p.reserved || 0) < line.qty || num(p.stock || 0) < line.qty) fail('reservation_invalid');
      }
      for (const line of order.items) {
        const p = db.products.find(x => x.id === line.productId);
        p.reserved -= line.qty;
        p.stock -= line.qty;
      }
      order.reservationState = 'committed';
    }
    order.payment = 'paid';
    order.status = 'preparing';
    if (!Array.isArray(db.activity)) db.activity = [];
    db.activity.unshift({date: new Date().toISOString(), text: 'Pago validado manualmente (demo): ' + order.id});
    write(db, storage);
    return {order, db};
  }
  function cancelOrder(orderId, storage) {
    const db = read(storage);
    if (!db) fail('panel_not_initialized');
    const order = db.orders.find(o => o.id === orderId);
    if (!order) fail('order_not_found');
    if (order.payment === 'paid' || order.reservationState === 'committed')
      fail('paid_order_requires_refund');
    if (order.status === 'cancelled') fail('already_cancelled');
    if (order.reservationState === 'held') {
      for (const line of order.items) {
        const p = db.products.find(x => x.id === line.productId);
        if (!p || num(p.reserved || 0) < line.qty) fail('reservation_invalid');
      }
      for (const line of order.items) db.products.find(x => x.id === line.productId).reserved -= line.qty;
      order.reservationState = 'released';
    }
    order.status = 'cancelled';
    order.payment = 'pending';
    if (!Array.isArray(db.activity)) db.activity = [];
    db.activity.unshift({date: new Date().toISOString(), text: 'Pedido cancelado (demo): ' + order.id});
    write(db, storage);
    return {order, db};
  }
  function deleteOrder(orderId, storage) {
    const db = read(storage);
    if (!db) fail('panel_not_initialized');
    const order = db.orders.find(o => o.id === orderId);
    if (!order) fail('order_not_found');
    if (order.payment === 'paid' || order.reservationState === 'committed') fail('paid_order_requires_refund');
    if ((db.returns || []).some(r => r.orderId === orderId)) fail('order_has_returns');
    if (order.reservationState === 'held') {
      const result = cancelOrder(orderId, storage);
      Object.assign(db, result.db);
    }
    db.orders = db.orders.filter(o => o.id !== orderId);
    write(db, storage);
    return {db};
  }
  function itemForReturn(order, index, returns) {
    const line = order?.items?.[index];
    if (!line || !validQty(line.qty)) return null;
    const amount = num(line.lineTotal);
    // Legacy demos never stored line-level monetary snapshots: do NOT invent a refund.
    const price = Number.isFinite(amount) && amount >= 0 ? money(amount / line.qty) : null;
    const prev = (returns || []).filter(r => r.orderId === order.id &&
      num(r.itemIndex) === num(index) && r.status !== 'rejected')
      .reduce((s, r) => s + num(r.qty || 0), 0);
    return {
      index, qty: line.qty, maxQty: Math.max(0, line.qty - prev),
      name: line.name, productId: line.productId || '',
      price, amountKnown: price !== null
    };
  }
  function diagnostic(db) {
    if (!db) return [{level:'critical',code:'no_panel_data'}];
    const findings = [];
    for (const p of db.products) {
      if (!Number.isFinite(num(p.stock)) || num(p.stock) < 0 ||
          num(p.reserved || 0) < 0 || num(p.reserved || 0) > num(p.stock))
        findings.push({level:'critical',code:'invalid_stock',id:p.id});
    }
    for (const o of db.orders) {
      if (o.reservationState === 'held') {
        for (const row of o.items || []) {
          if (!db.products.some(p => p.id === row.productId))
            findings.push({level:'critical',code:'orphan_reservation',id:o.id});
        }
      }
      if (!o.items?.length || o.items.some(x => x.lineTotal === undefined))
        findings.push({level:'migration_blocker',code:'legacy_order_missing_snapshots',id:o.id});
      if (o.payment === 'paid' && o.status === 'pending')
        findings.push({level:'critical',code:'inconsistent_payment_state',id:o.id});
    }
    for (const r of db.returns || []) {
      if (!db.orders.some(o => o.id === r.orderId))
        findings.push({level:'critical',code:'orphan_return',id:r.id});
    }
    return findings;
  }
  return {KEY, read, write, catalog, checkout, approvePayment, cancelOrder,
    deleteOrder, itemForReturn, available, diagnostic};
});
