export const toCents = (n) => Math.round(Number(n || 0) * 100);
export const money = (cents) => (Number(cents || 0) / 100).toFixed(2);

export function nextCart(cartMap, action) {
  const cart = new Map(cartMap);
  switch (action.type) {
    case "add": {
      const { id, priceCents, qty = 1 } = action;
      const prev = cart.get(id) || { priceCents, qty: 0 };
      cart.set(id, { priceCents, qty: prev.qty + qty });
      return cart;
    }
    case "setQty": {
      const { id, qty } = action;
      if (!cart.has(id)) return cart;
      if (qty <= 0) { cart.delete(id); return cart; }
      const { priceCents } = cart.get(id);
      cart.set(id, { priceCents, qty });
      return cart;
    }
    case "remove": {
      cart.delete(action.id);
      return cart;
    }
    case "reset":
      return new Map();
    default:
      return cart;
  }
}

export function computeTotals(cartMap, taxRate = 0.10) {
  let subtotal = 0;
  for (const { priceCents, qty } of cartMap.values()) {
    subtotal += priceCents * qty;
  }
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
