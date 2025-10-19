const express = require("express");
const router = express.Router();
const Food = require("../models/foodModel");
const Order = require("../models/orderModel");
const { getCart, replaceCart, computeTotals } = require("../utils/cartStore");

router.post("/", async (req, res) => {
  const cartMap = getCart();
  if (!cartMap || cartMap.size === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const validated = [];
  for (const [id, { qty }] of cartMap.entries()) {
    const food = await Food.findById(id).lean();
    if (!food) return res.status(404).json({ error: `Item not found: ${id}` });
    const priceCents = Math.round(Number(food.price) * 100);
    validated.push([id, { name: food.name, qty, priceCents }]);
  }

  const safeMap = new Map(validated);
  const totals = computeTotals(safeMap);

  const order = await Order.create({
    items: Array.from(safeMap, ([foodId, v]) => ({ foodId, ...v })),
    totals,
    status: "CONFIRMED",
  });

  replaceCart(new Map());

  return res.status(201).json({ ok: true, orderId: String(order._id), totals });
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;
