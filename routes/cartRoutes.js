const express = require("express");
const router = express.Router();

const { requireId, requirePositiveInt } = require("../utils/cartValidation");
const { nextCart } = require("../public/cart");
const { getCart, replaceCart, computeTotals } = require("../utils/cartStore");

function normalizePriceCents(body) {
  if (body.priceCents != null) return Number(body.priceCents);
  if (body.price != null) return Math.round(Number(body.price) * 100);
  return 0;
}

function withNames(prevMap, updatedMap, provided) {
  const out = new Map();
  for (const [k, v] of updatedMap) {
    const providedName = provided && provided.id === k ? provided.name : undefined;
    const keptName = v.name ?? providedName ?? (prevMap.get(k)?.name) ?? k;
    out.set(k, { ...v, name: keptName });
  }
  return out;
}

function sendState(res) {
  const cart = getCart();
  return res.json({
    ok: true,
    cart: Array.from(cart),
    totals: computeTotals(cart),
  });
}

router.post(
  "/add",
  requireId,
  requirePositiveInt("qty"),
  (req, res, next) => {
    try {
      const id = String(req.body.id);
      const qty = Number(req.body.qty);
      const priceCents = normalizePriceCents(req.body);
      const updated = nextCart(getCart(), { type: "add", id, qty, priceCents, name: req.body.name });
      const merged = withNames(getCart(), updated, { id, name: req.body.name });
      replaceCart(merged);
      return res.status(201).json({
        ok: true,
        cart: Array.from(getCart()),
        totals: computeTotals(getCart()),
      });
    } catch (e) { next(e); }
  }
);

router.post(
  "/setQty",
  requireId,
  requirePositiveInt("qty"),
  (req, res, next) => {
    try {
      const { id, qty } = req.body;
      const updated = nextCart(getCart(), { type: "setQty", id: String(id), qty: Number(qty) });
      const merged = withNames(getCart(), updated);
      replaceCart(merged);
      return sendState(res);
    } catch (e) { next(e); }
  }
);

router.post(
  "/remove",
  requireId,
  (req, res, next) => {
    try {
      const { id } = req.body;
      const updated = nextCart(getCart(), { type: "remove", id: String(id) });
      const merged = withNames(getCart(), updated);
      replaceCart(merged);
      return sendState(res);
    } catch (e) { next(e); }
  }
);

router.get("/state", (_req, res) => sendState(res));

router.get("/debug", (_req, res) => {
  const list = Array.from(getCart().entries()).map(([id, v]) => ({ id, ...v }));
  res.json({ items: list, totals: computeTotals(getCart()) });
});

module.exports = router;
