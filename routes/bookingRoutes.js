const express = require("express");
const {
	createBooking,
    getAvailableTimes,
    updateBooking
} = require("../controllers/bookingController.js");

const router = express.Router();

router.get("/", getAvailableTimes);
router.post("/create", createBooking);
router.post("/edit/:id", updateBooking);
router.get("/edit/:id", getAvailableTimes);

module.exports = router;
