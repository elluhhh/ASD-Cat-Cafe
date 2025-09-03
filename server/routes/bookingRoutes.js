const express = require("express");
const { getBookings, deleteBooking } = require('.../controllers/bookingController.js');

const router = express.Router();

router.get('/', getBookings);
router.post('/', deleteBooking);

module.exports = router;