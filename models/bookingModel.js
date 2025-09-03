const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	f_name: String,
	l_name: String,
	email: String,
	attendees_no: Number,
	date_time: Date,
	total_price: Number,
});

//gets all bookings from db
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
