const express = require("express");
const router = express.Router();
const { requireId, requirePositiveInt } = require("../utils/cartValidation");
const { nextCart, computeTotals } = require("../public/cart");

let cart = new Map();
const sendState = (res) => res.json({ ok: true, cart: Array.from(cart), totals: computeTotals(cart) });

router.post("/add",
  requireId,
  requirePositiveInt("qty"),
  requirePositiveInt("priceCents"),
  (req, res, next) => {
    try {
      const { id, qty, priceCents } = req.body;
      cart = nextCart(cart, { type: "add", id: String(id), qty, priceCents });
      return res.status(201).json({ ok: true, cart: Array.from(cart), totals: computeTotals(cart) });
    } catch (e) { next(e); }
  }
);

router.post("/setQty",
  requireId,
  requirePositiveInt("qty"),
  (req, res, next) => {
    try {
      const { id, qty } = req.body;
      cart = nextCart(cart, { type: "setQty", id: String(id), qty });
      return sendState(res);
    } catch (e) { next(e); }
  }
);

router.post("/remove",
  requireId,
  (req, res, next) => {
    try {
      const { id } = req.body;
      cart = nextCart(cart, { type: "remove", id: String(id) });
      return sendState(res);
    } catch (e) { next(e); }
  }
);

module.exports = router;
