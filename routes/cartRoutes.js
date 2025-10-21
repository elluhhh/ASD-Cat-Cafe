const express = require("express");
const router = express.Router();

const { requireId, requirePositiveInt } = require("../utils/cartValidation");
const { nextCart } = require("../public/cart");
const { getCart, replaceCart, computeTotals } = require("../utils/cartStore");
const Food = require("../models/foodModel");

function withNames(prevMap, updatedMap, provided) {
  const out = new Map();
  for (const [k, v] of updatedMap) {
    const providedName = provided && provided.id === k ? provided.name : undefined;
    const keptName = v.name ?? providedName ?? (prevMap.get(k)?.name) ?? k;
    out.set(k, { ...v, name: keptName });
  }
  return out;
}

function sendState(req, res) {
  const cart = getCart(req);
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
  async (req, res, next) => {
    try {
      const id = String(req.body.id);
      const qty = Number(req.body.qty);

      const food = await Food.findById(id).lean();
      if (!food) return res.status(404).json({ error: "Item not found" });

      const priceCents = Math.round(Number(food.price) * 100);
      const name = food.name;

      const prev = getCart(req); 
      const updated = nextCart(prev, { type: "add", id, qty, priceCents, name });
      const merged = withNames(prev, updated, { id, name });
      replaceCart(req, merged);  

      return res.status(201).json({
        ok: true,
        cart: Array.from(getCart(req)),    
        totals: computeTotals(getCart(req)) 
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/setQty",
  requireId,
  requirePositiveInt("qty"),
  (req, res, next) => {
    try {
      const { id, qty } = req.body;
      const prev = getCart(req); 
      const updated = nextCart(prev, { type: "setQty", id: String(id), qty: Number(qty) });
      const merged = withNames(prev, updated);
      replaceCart(req, merged);  
      return sendState(req, res); 
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/remove",
  requireId,
  (req, res, next) => {
    try {
      const { id } = req.body;
      const prev = getCart(req); 
      const updated = nextCart(prev, { type: "remove", id: String(id) });
      const merged = withNames(prev, updated);
      replaceCart(req, merged);  
      return sendState(req, res); 
    } catch (e) {
      next(e);
    }
  }
);

router.get("/state", (req, res) => sendState(req, res));

router.get("/debug", (req, res) => {
  const cart = getCart(req); 
  const list = Array.from(cart.entries()).map(([id, v]) => ({ id, ...v }));
  res.json({ items: list, totals: computeTotals(cart) });
});

module.exports = router;
