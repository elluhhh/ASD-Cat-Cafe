const express = require("express");
const { getCheckout, getBookingCheckout, processPayment, processBookingPayment } = require("../controllers/checkoutController");
const router = express.Router();

router.get("/", getCheckout);
router.get("/:id", getBookingCheckout);
router.post("/process", processPayment);
router.post("/process/:id", processBookingPayment);

module.exports = router;
