const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: String,
    gender: String,
    dob: Date,
    breed: String,
    price: { type: Number, min: 0 },
    microchipId: { type: Number, unique: true, sparse: true },
    colour: String,
    description: String,
    imageUrl: String,
    ageMonths: { type: Number, min: 0 },
    isAdopted: { type: Boolean, default: false },
}, { timestamps: true });

catSchema.virtual('ageYears').get(function () {
    if (typeof this.ageMonths !== 'number') return null;
    return (this.ageMonths / 12).toFixed(1);
});

catSchema.index({ name: 'text', breed: 'text' });

module.exports = { Cat: mongoose.model('Cat', catSchema) };