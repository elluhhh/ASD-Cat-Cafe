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
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

//It takes ageMonths, divides by 12, and formats to 1 decimal place (e.g. 14 months → 1.2 years). 
// If ageMonths is missing or invalid, it returns null.
catSchema.virtual('ageYears').get(function () {
    if (typeof this.ageMonths !== 'number') return null;
    return (this.ageMonths / 12).toFixed(1);
});

//This sets up a MongoDB text index for full-text search across the name and breed fields. Not used yet.
catSchema.index({ name: 'text', breed: 'text' });

module.exports = { Cat: mongoose.model('Cat', catSchema) };