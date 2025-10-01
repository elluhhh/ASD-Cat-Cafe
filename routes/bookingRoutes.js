const express = require("express");
const {
	createBooking,
    getAvailableTimes
} = require("../controllers/bookingController.js");

const router = express.Router();

router.get("/", getAvailableTimes);
router.post("/create", createBooking);

module.exports = router;
