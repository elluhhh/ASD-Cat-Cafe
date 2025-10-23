const path = require("path");

const {
  toCents,
  money,
  nextCart,
  computeTotals,
} = require(path.join(__dirname, "..", "public", "cart.js"));

describe("cart utils", () => {
  test("toCents/money round trip", () => {
    expect(toCents(7.5)).toBe(750);
    expect(money(750)).toBe("7.50");
    expect(money(toCents(0))).toBe("0.00");
  });

  test("running total with menu.json items", () => {
    let cart = new Map();
    cart = nextCart(cart, { type: "add", id: 1, priceCents: toCents(4.5), qty: 1 });
    cart = nextCart(cart, { type: "add", id: 2, priceCents: toCents(5.0), qty: 1 });

    let t = computeTotals(cart, 0.10);
    expect(t.subtotal).toBe(950);
    expect(t.tax).toBe(95);
    expect(t.total).toBe(1045);

    cart = nextCart(cart, { type: "setQty", id: 1, qty: 3 });
    t = computeTotals(cart, 0.10);
    expect(t.subtotal).toBe(1850);
    expect(t.tax).toBe(185);
    expect(t.total).toBe(2035);

    cart = nextCart(cart, { type: "remove", id: 2 });
    t = computeTotals(cart, 0.10);
    expect(t.subtotal).toBe(1350);
    expect(t.tax).toBe(135);
    expect(t.total).toBe(1485);
  });
});
