const Order = require("../models/orderModel");
const Booking = require("../models/bookingModel");

const toMoney = (cents) => (Number(cents || 0) / 100).toFixed(2);

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

const getBookingCheckout = async (req, res) => {
  try {
    const bookingID = req.params.id;
    const booking = await Booking.findById(bookingID);
    const cartItems = [];
    const total = booking.total_price * 100;
    const tax = total * 0.1 * 10;
    const subtotal = total - tax;

    res.render("checkout", {
      booking, cartItems, subtotal, tax, total, toMoney
    });
  } catch (err) {
    console.error("booking checkout error", err);
  }
};

const processPayment = async (req, res) => {
  try {
    const { orderId, cardNumber, cardName, expiry, cvc, cvv, email } = req.body;
    
    if (!orderId) return res.status(400).send("Missing orderId");

    // Simple validation
    validation(res, cardNumber, cardName, expiry, cvc, cvv, email);

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

const processBookingPayment = async (req, res) => {
  try {
    const { cardNumber, cardName, expiry, cvc, cvv, email } = req.body;
    const booking = await Booking.findById(req.params.id);

    validation(res, cardNumber, cardName, expiry, cvc, cvv, email);

    // Render success page
    return res.render("paymentSuccess", {
      orderNumber: String(booking._id),
      email: email,
      cartItems: [],
      total: (booking.total_price / 100).toFixed(2)
    });
  } catch (err) {
    console.error("[processPayment] error:", err);
    return res.status(500).send("Payment processing failed: " + err.message);
  }
};

function validation(res, cardNumber, cardName, expiry, cvc, cvv, email) {
  const digits = String(cardNumber || "").replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) return res.status(400).send("Invalid card number");
  if (!cardName) return res.status(400).send("Name on card is required");
  if (!expiry || !/^\d{2}\/\d{2}$/.test(String(expiry))) return res.status(400).send("Invalid expiry");
  const sec = String(cvc || cvv || "");
  if (!/^\d{3,4}$/.test(sec)) return res.status(400).send("Invalid CVC");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) return res.status(400).send("Invalid email");
}

module.exports = { getCheckout, getBookingCheckout, processPayment, processBookingPayment };
