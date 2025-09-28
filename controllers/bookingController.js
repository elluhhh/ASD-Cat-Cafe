const Booking = require("../models/bookingModel.js");

const getBookings = async (req, res) => {
	try {
		const bookings = await Booking.find().sort({date_time: 1});
		res.render("bookingManagement", { bookings });
	} catch (err) {
		res.status(500).send(err);
	}
};

const deleteBooking = async (req, res) => {
	try {
		await Booking.findByIdAndDelete(req.params.id);
		res.redirect("/bookingManagement");
	} catch (err) {
		res.status(500).send(err);
	}
};

const findBookings = async (req, res) => {
	try {
		const bookings = await Booking.find().or([
			{_id: req.body.id},
			{email: req.body.email},
			{date_time: req.body.date}
		]).exec();
		res.render("bookingManagement", { bookings });
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	getBookings,
	deleteBooking,
	findBookings
};
