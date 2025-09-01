const mongoose = require("mongoose");

const bookingSchema = new mongoose.SchemaType({
    first_name: String,
    last_name: String,
    email: String,
    no_attendees: Number,
    total_price: Number,
    date_time: Date
});

//gets all bookings from db
const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;