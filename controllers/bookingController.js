const Booking = require("../models/bookingModel.js");
const mongoose = require("mongoose");

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
			{date_time: {
				$gte: new Date(req.body.date),
				$lt: new Date(new Date(req.body.date).getTime() + 60 * 60 * 34 * 1000)
			}}
		]).exec();
		res.render("bookingManagement", { bookings });
	} catch (err) {
		// add validation checks
		// valid id
		// valid date
		res.status(500).send(err);
	}
};

module.exports = {
	getBookings,
	deleteBooking,
	findBookings
};
