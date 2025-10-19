const path = require("path");
const fs = require("fs").promises;
const { getCart, computeTotals, replaceCart } = require("../utils/cartStore");

async function loadMenuMap() {
  try {
    const json = await fs.readFile(path.join(__dirname, "..", "data", "menu.json"), "utf-8");
    const items = JSON.parse(json);
    const m = new Map();
    for (const it of items) {
      if (it && it.id != null && it.name) m.set(String(it.id), String(it.name));
    }
    return m;
  } catch {
    return new Map();
  }
}

const getCheckout = async (_req, res) => {
  try {
    const cart = getCart();
    const menuMap = await loadMenuMap();
    const cartItems = Array.from(cart.entries()).map(([id, data]) => {
      const name = data.name || menuMap.get(String(id)) || String(id);
      const price = (data.priceCents || 0) / 100;
      const qty = Number(data.qty || 0);
      return { name, price, qty };
    });
    const { subtotal, tax, total } = computeTotals(cart);
    return res.render("checkout", { cartItems, subtotal, tax, total });
  } catch (err) {
    console.error("[getCheckout] error:", err);
    return res.status(500).send("Failed to load checkout");
  }
};

const processPayment = async (req, res) => {
  try {
    const { cardNumber, cardName, expiry, cvc, cvv, email } = req.body;
    const digits = String(cardNumber || "").replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) return res.status(400).send("Invalid card number");
    if (!cardName) return res.status(400).send("Name on card is required");
    if (!expiry) return res.status(400).send("Expiry is required");
    const sec = String(cvc || cvv || "");
    if (!/^\d{3,4}$/.test(sec)) return res.status(400).send("Invalid CVC");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) return res.status(400).send("Invalid email");

    const cart = getCart();
    const menuMap = await loadMenuMap();
    const cartItems = Array.from(cart.entries()).map(([id, data]) => {
      const name = data.name || menuMap.get(String(id)) || String(id);
      const price = (data.priceCents || 0) / 100;
      const qty = Number(data.qty || 0);
      return { name, price, qty };
    });
    const { subtotal, tax, total } = computeTotals(cart);
    replaceCart(new Map());
    return res.render("checkout", { cartItems, subtotal, tax, total, paid: true });
  } catch (err) {
    console.error("[processPayment] error:", err);
    return res.status(500).send("Payment processing failed");
  }
};

module.exports = { getCheckout, processPayment };