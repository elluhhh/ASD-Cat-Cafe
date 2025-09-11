const express = require("express");
const {
	getBookings,
	deleteBooking,
	findBookings,
} = require("../controllers/bookingController.js");

const router = express.Router();

router.get("/", getBookings);
router.delete("/", deleteBooking);
router.get("/", findBookings);

module.exports = router;
