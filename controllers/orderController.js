const Food = require("../models/foodModel");
const Order = require("../models/orderModel");
const { getCart, replaceCart, computeTotals } = require("../utils/cartStore");

exports.create = async (req, res) => {
  try {
    const cartMap = getCart(req);
    if (!cartMap || cartMap.size === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const ids = Array.from(cartMap.keys());
    const foods = await Food.find({ _id: { $in: ids }, status: "Available" }).lean();
    const foodById = new Map(foods.map(f => [String(f._id), f]));

    const validated = [];
    for (const [id, { qty }] of cartMap.entries()) {
      const food = foodById.get(String(id));
      if (!food) {
        return res.status(404).json({ error: `Item not found or unavailable: ${id}` });
      }
      const priceCents = Math.round(Number(food.price) * 100);
      validated.push([String(id), { name: food.name, qty, priceCents }]);
    }

    const safeMap = new Map(validated);
    const totals = computeTotals(safeMap);

    const items = Array.from(safeMap, ([foodId, v]) => ({
  foodId: String(foodId),
  name: v?.name ?? "",
  qty: Number(v?.qty ?? 0),
  priceCents: Number(v?.priceCents ?? 0),
}));

const order = await Order.create({
  items,
  totals,
  status: "CONFIRMED",
  createdAt: new Date()
});

    replaceCart(req, new Map());

    return res.status(201).json({ ok: true, orderId: String(order._id), totals });
  } catch (err) {
    console.error("Order create failed:", err);
    return res.status(500).json({ error: "Order failed" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (err) {
    console.error("Order get failed:", err);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};
