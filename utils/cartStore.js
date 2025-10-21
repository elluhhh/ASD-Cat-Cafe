const _fallbackCart = new Map();

function getCart(req) {

  if (req && req.session) {
    const raw = req.session.cart || [];

    return new Map(raw);
  }

  return _fallbackCart;
}

function replaceCart(req, updatedMap) {
  if (req && req.session) {
    req.session.cart = Array.from(updatedMap.entries());
    return;
  }
  _fallbackCart.clear();
  for (const [k, v] of updatedMap) _fallbackCart.set(k, v);
}

function computeTotals(cartMap, taxRate = 0.10) {
  let map;
  if (cartMap instanceof Map) {
    map = cartMap;
  } else if (cartMap && typeof cartMap[Symbol.iterator] === "function") {
    map = new Map(cartMap);
  } else {
    map = _fallbackCart;
  }

  let subtotal = 0;
  for (const { priceCents, qty } of map.values()) {
    subtotal += (priceCents || 0) * (qty || 0);
  }
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}


module.exports = { getCart, replaceCart, computeTotals };
