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
		
		await Booking.create({
			f_name: f_name,
			l_name: l_name,
			email: email,
			attendees_no: attendees,
			date_time: new Date(date).setHours(Number(time)),
			total_price: total_price,
			phone: phone
		});

		res.redirect("/");
	} catch (err) {
		res.status(500).send(err);
	}
};

const getAvailableTimes = async (req, res) => {
	try {
		const booking = mongoose.Types.ObjectId.isValid(req.params.id)? await Booking.findById(req.params.id) : "";
		const today = new Date();
		const date = req.query.date == "" || req.query.date == null || req.query.date == today.toISOString().split('T')[0]? today : new Date(req.query.date);
		
		const bookingsInDate = await Booking.find(
			{date_time: {
				$gte: date.setHours(0,0,0,0),
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
