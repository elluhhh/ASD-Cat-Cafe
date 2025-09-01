const Booking = require('models\bookingModel.js');

const getBookings = async(req, res) => {
    try {
        const bookings = await Booking.find();
        res.render('bookingManagement', { bookings });
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteBooking = async(req, res) => {
    try {
        //will get the userID from list of bookings sent from ejs
        let bookingData = await Booking.findbyIdAndDelete(req.param.userID);
        res.redirect('/bookingManagement');
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getBookings,
    deleteBooking
}