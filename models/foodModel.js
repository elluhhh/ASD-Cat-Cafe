// Jiyun Choi

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    status: String,
    stock: Number,
    vegan: Boolean,
    image: String
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;