const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
    name: String,
    gender: String,
    dob: String,
    breed: String,
    price: Number,
    microchipId: { type: Number, unique: true },
    colour: String,
    description: String,
    imageUrl: String,
    isAdopted: { type: Boolean, default: false }
});

// Create cat model with above schema
const Cat = mongoose.model('cat', catSchema);

module.exports = Cat;