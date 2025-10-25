// Jiyun Choi

const mongoose = require("mongoose");
const { Types, isValidObjectId } = mongoose;

const Food = require("../models/foodModel");
const Order = require("../models/orderModel");
const { getCart, replaceCart, computeTotals } = require("../utils/cartStore");

// Create a new order with stock check
exports.create = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const cartMap = getCart(req);
    if (!cartMap || cartMap.size === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Only keep valid ObjectIds to avoid cast errors
    const idStrings = Array.from(cartMap.keys()).filter(isValidObjectId);
    const ids = idStrings.map((id) => new Types.ObjectId(id));
    if (ids.length === 0) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    // Find menu items that are available
    const foods = await Food.find(
      { _id: { $in: ids }, status: "Available" },
      { name: 1, price: 1, stock: 1 }
    )
      .lean()
      .exec();

    // Create a map for quick lookups
    const foodById = new Map(foods.map((f) => [String(f._id), f]));

    // Check if each item exists and has enough stock
    for (const [id, { qty }] of cartMap.entries()) {
      const f = foodById.get(String(id));
      if (!f) {
        return res
          .status(404)
          .json({ error: `Item not found or unavailable: ${id}` });
      }
      if (Number(f.stock) < Number(qty)) {
        return res
          .status(409)
          .json({ error: `Not enough stock: ${f.name}` });
      }
    }

    let totals;
    let items;

    // Run the stock update and order creation in a transaction
    await session.withTransaction(async () => {
      // Decrease stock only if there’s enough quantity left
      const ops = [];
      for (const [id, { qty }] of cartMap.entries()) {
        ops.push({
          updateOne: {
            filter: { _id: new Types.ObjectId(id), stock: { $gte: Number(qty) } },
            update: { $inc: { stock: -Number(qty) } },
          },
        });
      }

      const result = await Food.bulkWrite(ops, { ordered: true, session });

      // If one of the updates failed, roll back
      const modified = result.modifiedCount ?? result.nModified ?? 0;
      if (modified !== ops.length) {
        throw new Error("Stock changed during checkout");
      }

      // Recalculate prices based on DB data
      const validated = [];
      for (const [id, { qty }] of cartMap.entries()) {
        const f = foodById.get(String(id));
        const priceCents = Math.round(Number(f.price) * 100);
        validated.push([String(id), { name: f.name, qty: Number(qty), priceCents }]);
      }

      const safeMap = new Map(validated);
      totals = computeTotals(safeMap);

      items = Array.from(safeMap, ([foodId, v]) => ({
        foodId: String(foodId),
        name: v?.name ?? "",
        qty: Number(v?.qty ?? 0),
        priceCents: Number(v?.priceCents ?? 0),
      }));

      // Create a new order record inside the transaction
      const order = await Order.create(
        [
          {
            items,
            totals,
            status: "CONFIRMED",
            createdAt: new Date(),
          },
        ],
        { session }
      );

      // Store new order ID for response
      req._newOrderId = String(order[0]._id);
    });

    // Clear the cart after successful order
    replaceCart(req, new Map());

    return res
      .status(201)
      .json({ ok: true, orderId: req._newOrderId, totals });
  } catch (err) {
    console.error("Order create failed:", err);
    if (String(err.message || "").includes("Stock changed")) {
      return res.status(409).json({ error: "Stock changed, please retry" });
    }
    return res.status(500).json({ error: "Order failed" });
  } finally {
    session.endSession();
  }
};

// Fetch a single order by ID
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
