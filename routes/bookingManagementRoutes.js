const express = require("express");
const {
	getBookings,
	deleteBooking,
	findBookings
} = require("../controllers/bookingManagementController.js");

const router = express.Router();

router.get("/", getBookings);
router.post("/delete/:id", deleteBooking);
router.post("/", findBookings);

module.exports = router;