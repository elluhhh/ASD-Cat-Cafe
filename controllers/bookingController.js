const Booking = require('models\bookingModel.js');

const getBookings = async(req, res) => {
    try {
        const bookings = await Booking.find();
        res.render('bookings', {booking});
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteBooking = async(req, res) => {
    try {
        let bookingData = await Booking.findbyIdAndDelete(/*id here*/);
        res.send(bookingData)
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getBookings,
    deleteBooking
}