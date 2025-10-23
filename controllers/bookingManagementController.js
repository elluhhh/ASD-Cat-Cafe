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
		var dateObj = new Date(req.body.date);

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
					$gte: dateObj,
					$lt: dateObj.getTime() + 24 * 60 * 60 * 1000
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

module.exports = {
	getBookings,
	deleteBooking,
	findBookings
};