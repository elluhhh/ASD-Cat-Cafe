// Ena Debnath
// Jiyun Choi (partial) - this section is shared with Ena Debnath's Checkout feature

const Order = require("../models/orderModel");
const Booking = require("../models/bookingModel");

const toMoney = (cents) => (Number(cents || 0) / 100).toFixed(2);

/**
 * GET /checkout?orderId=...
 * Display checkout page with order details
 */
const getCheckout = async (req, res) => {
  try {
    // avoid showing a cached checkout page when using browser back
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');

    // if query is missing, try the session (so re-entry still works)
    const orderId = req.query.orderId || (req.session && req.session.currentOrderId);
    if (!orderId) return res.redirect("/menu");

    const order = await Order.findById(orderId).lean();
    if (!order) {
      if (req.session) {
        req.session.currentOrderId = null;
        req.session.cartLocked = false;
      }
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

    // mark “in-progress” so we can clean/reset on cancel/back
    if (req.session) {
      req.session.currentOrderId = String(order._id);
      req.session.cartLocked = true;
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
    // same reason as food checkout: avoid stale page on back
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');

    const bookingID = req.params.id;
    const booking = await Booking.findById(bookingID);

    if (req.session) {
      req.session.cartLocked = true; // reuse the same flag for consistency
    }

    const cartItems = [];
    const total = Math.round((booking.total_price || 0) * 100); // keep everything in cents
    const tax = Math.round(total * 0.1);
    const subtotal = total - tax;

    res.render("checkout", {
      booking, cartItems, subtotal, tax, total, toMoney
    });
  } catch (err) {
    console.error("booking checkout error", err);
    return res.status(500).render("checkout", {
      booking: null,
      cartItems: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      error: "Failed to load booking checkout",
      toMoney
    });
  }
};

/**
 * POST /checkout/process
 * Process payment and update order status
 */
const processPayment = async (req, res) => {
  try {
    const { orderId, cardNumber, cardName, expiry, cvc, cvv, email } = req.body;

    const validationErrorMsg = validate(cardNumber, cardName, expiry, cvc, cvv, email);
    if (validationErrorMsg != "") {
      return res.status(400).send(validationErrorMsg);
    }
    
    // Validate orderId first
    if (!orderId) {
      return res.status(400).send("Missing orderId");
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Update order status - mock payment success
    order.status = "PAID";
    order.paidAt = new Date();
    order.paymentMethod = "CARD";
    await order.save();

    // after a successful payment, just clean up the session so cart/order doesn’t linger
    if (req.session) {
      req.session.cart = null;
      req.session.currentOrderId = null;
      req.session.cartLocked = false;
    }

    // Prepare data for success page
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
    return res.status(500).send("Payment processing failed");
  }
};

const processBookingPayment = async (req, res) => {
  try {
    const { cardNumber, cardName, expiry, cvc, cvv, email } = req.body;
    const booking = await Booking.findById(req.params.id);

    const validationErrorMsg = validate(cardNumber, cardName, expiry, cvc, cvv, email);
    if (validationErrorMsg != "") {
      return res.status(400).send(validationErrorMsg);
    }

    // normalize money as cents (same convention as food)
    const totalCents = Math.round((booking.total_price || 0) * 100);
    const taxCents = Math.round(totalCents * 0.1);
    const subtotalCents = totalCents - taxCents;

    await Order.create({
      booking: booking,
      totals: {
        subtotal: subtotalCents,
        tax: taxCents,
        total: totalCents
      },
      status: "PAID",
      paymentMethod: "CARD",
      paidAt: new Date()
    });

    // clean up session flags for consistency
    if (req.session) {
      req.session.cart = null;
      req.session.currentOrderId = null;
      req.session.cartLocked = false;
    }

    // Render success page
    return res.render("paymentSuccess", {
      orderNumber: String(booking._id),
      email: email,
      cartItems: [],
      total: (totalCents / 100).toFixed(2)
    });
  } catch (err) {
    console.error("[processPayment] error:", err);
    return res.status(500).send("Payment processing failed: " + err.message);
  }
};

function validate(cardNumber, cardName, expiry, cvc, cvv, email) {
  // Validate card number (16, digits, spaces allowed)
  const digits = String(cardNumber || "").replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)){
    return "Invalid card number";
  }
  
  // Validate cardholder name
  if (!cardName || String(cardName).trim() === ""){
    return "Name on card is required";
  }

  // Validate expiry (MM/YY format)
  if (!validateExpiry(expiry)){
    return "Invalid or expired card. Please check the expiry date (MM/YY format, month must be 01-12, and card must not be expired)";
  }
  
  // Validate CVC/CVV (3-4 digits)
  const sec = String(cvc || cvv || "");
  if (!/^\d{3,4}$/.test(sec)){
    return "Invalid CVC";
  }
  
  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))){
    return "Invalid email";
  }

  return "";
}

/**
 * Validate credit card expiry date
 * @param {string} expiry - Expiry in MM/YY format
 * @returns {boolean} - True if valid and not expired
 */
function validateExpiry(expiry) {
  // Check format: MM/YY
  if (!/^\d{2}\/\d{2}$/.test(String(expiry))) {
    return false;
  }

  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  // Validate month (01-12)
  if (month < 1 || month > 12) {
    return false;
  }

  // Convert 2-digit year to 4-digit (assume 20xx)
  const fullYear = 2000 + year;

  // Get current date
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

  // Check if card is expired
  // Card expires at the END of the expiry month
  if (fullYear < currentYear) {
    return false; // Year is in the past
  }
  
  if (fullYear === currentYear && month < currentMonth) {
    return false; // Same year but month has passed
  }

  return true;
}

module.exports = { getCheckout, getBookingCheckout, processPayment, processBookingPayment };
