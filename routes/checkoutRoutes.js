// Ena Debnath
// Jiyun Choi (partial) - this section is shared with Ena Debnath's Checkout feature

const express = require("express");
const { getCheckout, getBookingCheckout, processPayment, processBookingPayment } = require("../controllers/checkoutController");
const router = express.Router();

router.get("/", getCheckout);

// added this route to reset session when user goes back or cancels checkout
// (basically clears the cart and unlocks session so it doesn’t stay “stuck” after going back)
router.get("/cancel", (req, res) => {
  if (req.session) {
    req.session.cart = null;
    req.session.currentOrderId = null;
    req.session.cartLocked = false;
  }
  return res.redirect("/menu"); // send user back to the menu page
});

router.get("/:id", getBookingCheckout);
router.post("/process", processPayment);
router.post("/process/:id", processBookingPayment);

module.exports = router;
