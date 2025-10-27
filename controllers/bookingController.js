//Ella Gibbs
const Booking = require("../models/bookingModel.js");
const mongoose = require("mongoose");

const updateBooking = async (req, res) => {
	try {
		const {date, time, attendees, total_price} = req.body;
		const id = req.params.id;
		
		await Booking.findOneAndUpdate({_id: id}, {
			attendees_no: attendees,
			date_time: new Date(date).setHours(Number(time), 0, 0),
			total_price: total_price
		});
		res.redirect("/bookingManagement");
	} catch (err) {
		res.status(500).send(err);
	}
};

const createBooking = async (req, res) => {
	try {
		const {date, time, attendees, total_price, f_name, l_name, email, phone} = req.body;
		console.log(time);

		if(typeof time === 'undefined'){
			return res.redirect("/booking");
		}
		
		const booking = await Booking.create({
			f_name: f_name,
			l_name: l_name,
			email: email,
			attendees_no: attendees,
			date_time: new Date(date).setHours(Number(time), 0, 0),
			total_price: total_price,
			phone: phone
		});

		res.redirect("/checkout/" + booking._id);
	} catch (err) {
		res.status(500).send(err);
	}
};

const getAvailableTimes = async (req, res) => {
	try {
		// Gets a booking if editing a booking
		const booking = mongoose.Types.ObjectId.isValid(req.params.id)? await Booking.findById(req.params.id) : "";
		const today = new Date();

		// If no date has been selected, default to today's date, otherwise create a new Date obj from the selected date
		const date = req.query.date == "" || req.query.date == null || req.query.date == today.toISOString().split('T')[0]? today : new Date(req.query.date);
		
		// Retrieve all the bookings in the selected date
		const bookingsInDate = await Booking.find(
			{date_time: {
				$gte: new Date(date).setHours(0,0,0,0),
				$lt: new Date(date).getTime() + 60 * 60 * 34 * 1000
			}}
		).exec();
		
		const availBookingTimes = [10, 11, 12, 13, 14, 15];

		// Removes the times that already have bookings
		bookingsInDate.forEach(booking => {
			const index = availBookingTimes.indexOf(booking.date_time.getHours());
			if(index > -1){
				availBookingTimes.splice(index, 1);
			}
		});
		
		// Remove the times for today that are before the current time e.g. it is 2pm therefore, <=2 should be unselectable
		if(date == today && availBookingTimes.includes(date.getHours())){
			availBookingTimes.splice(0, availBookingTimes.indexOf(date.getHours())+1);
		}
		else if(date.getHours() >= 15){
			availBookingTimes.splice(0, availBookingTimes.length);
		}

		res.render("booking", { availBookingTimes, date, booking });
		
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	updateBooking,
	createBooking,
	getAvailableTimes
};
