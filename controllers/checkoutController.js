// controllers/checkoutController.js
const Order = require("../models/orderModel");

const toMoney = (cents) => (Number(cents || 0) / 100).toFixed(2);

/**
 * GET /checkout?orderId=...
 * DB에서 주문을 조회해 Checkout 화면을 렌더링
 */
const getCheckout = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    if (!orderId) return res.redirect("/food");

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return res.status(404).render("checkout", {
        cartItems: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        error: "Order not found",
        paid: false,
        orderId: null,
        toMoney
      });
    }

    const cartItems = (order.items || []).map((it) => ({
      name: it.name,
      price: Number(it.priceCents || 0) / 100,
      qty: Number(it.qty || 0),
    }));

    const { subtotal = 0, tax = 0, total = 0 } = order.totals || {};

    return res.render("checkout", {
      cartItems,
      subtotal,
      tax,
      total,
      error: null,
      paid: order.status === "PAID",
      orderId: String(order._id),
      toMoney
    });
  } catch (err) {
    console.error("[getCheckout] error:", err);
    return res.status(500).render("checkout", {
      cartItems: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      error: "Failed to load checkout",
      paid: false,
      orderId: null,
      toMoney
    });
  }
};

const processPayment = async (req, res) => {
  try {
    const { orderId, cardNumber, cardName, expiry, cvc, cvv, email } = req.body;
    
    if (!orderId) return res.status(400).send("Missing orderId");

    // Simple validation
    const digits = String(cardNumber || "").replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) return res.status(400).send("Invalid card number");
    if (!cardName) return res.status(400).send("Name on card is required");
    if (!expiry || !/^\d{2}\/\d{2}$/.test(String(expiry))) return res.status(400).send("Invalid expiry");
    const sec = String(cvc || cvv || "");
    if (!/^\d{3,4}$/.test(sec)) return res.status(400).send("Invalid CVC");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) return res.status(400).send("Invalid email");

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send("Order not found");

    // Mock payment success processing
    order.status = "PAID";
    order.paidAt = new Date();
    order.paymentMethod = "CARD";
    await order.save();

    const cartItems = (order.items || []).map((it) => ({
      name: it.name,
      price: Number(it.priceCents || 0) / 100,
      qty: Number(it.qty || 0),
    }));
    const { total = 0 } = order.totals || {};

    // Render success page
    console.log("Payment successful, rendering paymentSuccess page"); // Debug log
    return res.render("paymentSuccess", {
      orderNumber: String(order._id),
      email: email,
      cartItems: cartItems,
      total: (total / 100).toFixed(2)
    });
    
  } catch (err) {
    console.error("[processPayment] error:", err);
    return res.status(500).send("Payment processing failed: " + err.message);
  }
};

module.exports = { getCheckout, processPayment };
