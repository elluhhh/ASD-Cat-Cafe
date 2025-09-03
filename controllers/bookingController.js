const Booking = require("../models/bookingModel.js");

const getBookings = async (req, res) => {
	try {
		const bookings = await Booking.find();
		res.render("bookingManagement", { bookings });
	} catch (err) {
		res.status(500).send(err);
	}
};

const deleteBooking = async (req, res) => {
	try {
		Booking.findbyIdAndDelete(req.param.bookingID);
		res.redirect("bookingManagement");
	} catch (err) {
		res.status(500).send(err);
	}
};

const findBookings = async (req, res) => {
	try {
		const { id_, email } = req.body;
		const bookingSearch = await Booking.find({
			id_: id_,
			email: email
		}).exec();
		res.render("bookingManagement", { bookingSearch });
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	getBookings,
	deleteBooking,
	findBookings
};
