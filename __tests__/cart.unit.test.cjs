const path = require('path');
const fs = require('fs');

let nextCart, computeTotals, toCents;

beforeAll(async () => {
  const abs = path.resolve(__dirname, '..', 'public', 'cart.js');
  const src = fs.readFileSync(abs, 'utf8');
  const dataUrl =
    'data:text/javascript;charset=utf-8,' + encodeURIComponent(src);
  const mod = await import(dataUrl);

  if (
    typeof mod.toCents !== 'function' ||
    typeof mod.nextCart !== 'function' ||
    typeof mod.computeTotals !== 'function'
  ) {
    throw new Error(
      'cart.js expected exports not found: toCents/nextCart/computeTotals'
    );
  }
  ({ nextCart, computeTotals, toCents } = mod);
});

test('running total with menu.json items', () => {
  let cart = new Map();
  cart = nextCart(cart, { type: 'add', id: 1, priceCents: toCents(4.5), qty: 1 });
  cart = nextCart(cart, { type: 'add', id: 2, priceCents: toCents(5.0), qty: 1 });

  let t = computeTotals(cart, 0.10);
  expect(t.subtotal).toBe(950);
  expect(t.tax).toBe(95);
  expect(t.total).toBe(1045);

  cart = nextCart(cart, { type: 'setQty', id: 1, qty: 3 });
  t = computeTotals(cart, 0.10);
  expect(t.subtotal).toBe(1850);
  expect(t.tax).toBe(185);
  expect(t.total).toBe(2035);

  cart = nextCart(cart, { type: 'remove', id: 2 });
  t = computeTotals(cart, 0.10);
  expect(t.subtotal).toBe(1350);
  expect(t.tax).toBe(135);
  expect(t.total).toBe(1485);
});
