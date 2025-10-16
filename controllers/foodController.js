const Food = require("../models/foodModel.js");

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.render("foodManagement", { foods });
    } catch (err) {
        res.status(500).send(err);
    }
};

const seedFoods = async (req, res) => {
    try {
        await Food.deleteMany({});
        const sampleFoods = [
            { name: "Cat-puccino", category: "drink", price: 4.5, status: "Available", stock: 25, vegan: false, description: "Coffee with pawprint foam", image: "/images/catpuccino.png" },
            { name: "Whisker Latte", category: "drink", price: 5.0, status: "Available", stock: 18, vegan: true, description: "Oat milk latte", image: "/images/whisker.png" },
            { name: "Tuna Melt", category: "food", price: 8.9, status: "Unavailable", stock: 0, vegan: false, description: "Tuna and cheese toastie", image: "/images/toast.png" },
            { name: "Catnip Cookies", category: "food", price: 3.5, status: "Available", stock: 8, vegan: true, description: "Human-safe cookies", image: "/images/cookies.png" }
        ];
        await Food.insertMany(sampleFoods);
        res.redirect("/foodManagement");
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getFoods,
    seedFoods
};