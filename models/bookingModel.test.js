const Booking = require('./bookingModel');
const mongoose = require("mongoose");

beforeAll(async () => {
    mongoose.connect(
        "mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website"
    )
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe("database functionality", () => {
    it("adds booking to db", async () => {
        const booking = await new Booking({
            f_name: "TestFName",
            l_name: "TestLName",
            email: "Test@example.com",
            phone: "0477 777 777",
            attendees_no: 3,
            date_time: new Date(),
            total_price: 84
        }).save()

        var fetchedBooking = await Booking.findById(booking._id)

        expect(fetchedBooking._id).toEqual(booking._id)
    })

    it("deletes booking from db", async () => {
        const booking = await Booking.findOne({
            f_name: "TestFName",
            l_name: "TestLName",
            email: "Test@example.com"
        })

        await Booking.findByIdAndDelete(booking._id);

        fetchedBooking = await Booking.findById(booking._id);

        expect(fetchedBooking).toBeNull();
    })
})

