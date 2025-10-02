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
		const {id, email, date} = req.body
		var bookings = new Array();

		if(mongoose.Types.ObjectId.isValid(id)) {
			bookings.push(await Booking.findById(id));
		}

		if(email != "") {
			bookings = bookings.concat(await Booking.find(
				{email: email}
			).exec());
		}

		if(date != "") {
			bookings = bookings.concat(await Booking.find(
				{date_time: {
					$gte: new Date(req.body.date),
					$lt: new Date(new Date(req.body.date).getTime() + 60 * 60 * 34 * 1000)
				}}
			).exec());
		}

		//remove empty arrays from bookings array
		bookings = bookings.filter(e=> {
			if(Array.isArray(e) && e.length == 0){
				return false;
			} else {
				return true;
			}
		});
		
		res.render("bookingManagement", { bookings });
	} catch (err) {
		res.status(500).send(err);
	}
};

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
		const id = typeof req.params.id == "undefined" ? "" : req.params.id;
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

		res.render("booking", { availBookingTimes, date, id });
		
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	getBookings,
	deleteBooking,
	findBookings,
	updateBooking,
	createBooking,
	getAvailableTimes
};
