const express = require("express");
const {
	getBookings,
	deleteBooking,
	findBookings,
	updateBooking,
	getAvailableTimes
} = require("../controllers/bookingController.js");

const router = express.Router();

router.get("/", getBookings);
router.post("/delete/:id", deleteBooking);
router.post("/", findBookings);
router.get("/edit/:id", updateBooking);

module.exports = router;