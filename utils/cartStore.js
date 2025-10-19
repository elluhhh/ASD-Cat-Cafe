const _cart = new Map();

function getCart() {
  return _cart;
}

function replaceCart(updatedMap) {
  _cart.clear();
  for (const [k, v] of updatedMap) _cart.set(k, v);
}

function computeTotals(cartMap = _cart, taxRate = 0.10) {
  let subtotal = 0;
  for (const { priceCents, qty } of cartMap.values()) {
    subtotal += priceCents * qty;
  }
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

module.exports = { getCart, replaceCart, computeTotals };
