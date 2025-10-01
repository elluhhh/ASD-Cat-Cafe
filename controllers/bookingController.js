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

const createBooking = async (req, res) => {
	try {
		const {date, time, attendees, total_price, f_name, l_name, email, phone} = req.body;
		
		await Booking.create({
			f_name: f_name,
			l_name: l_name,
			email: email,
			attendees_no: attendees,
			date_time: new Date(date).setHours(Number(time)),
			total_price: total_price,
			phone: phone
		});
		
		res.redirect("/booking");
	} catch (err) {
		res.status(500).send(err);
	}
};

const getAvailableTimes = async (req, res) => {
	try {
		const today = new Date();
		const date = req.query.date == "" || req.query.date == null || req.query.date == today.toISOString().split('T')[0]? new Date() : new Date(req.query.date);
		
		const bookingsInDate = await Booking.find(
			{date_time: {
				$gte: date,
				$lt: new Date(date.getTime() + 60 * 60 * 34 * 1000)
			}}
		).exec();
		
		const availBookingTimes = [10, 11, 12, 13, 14, 15];

		//removes times that have bookings
		bookingsInDate.forEach(booking => {
			const index = availBookingTimes.indexOf(booking.date_time.getHours());
			if(index > -1){
				availBookingTimes.splice(index, 1);
			}
		});
		
		//remove times for today that before the current time e.g. it is 2pm therefore, <=2 should be unselectable
		if(date == today && availBookingTimes.includes(date.getHours())){
			availBookingTimes.splice(0, availBookingTimes.indexOf(date.getHours() + 1));
		}
		else if(date.getHours() >= 15){
			availBookingTimes.splice(0, availBookingTimes.length);
		}

		res.render("booking", { availBookingTimes, date });
		
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	getBookings,
	deleteBooking,
	findBookings,
	createBooking,
	getAvailableTimes
};
