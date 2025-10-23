//Ella Gibbs
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	f_name: String,
	l_name: String,
	email: String,
	phone: String,
	attendees_no: Number,
	date_time: Date,
	total_price: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
