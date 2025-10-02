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

// Add Food Item (U117)
const addFood = async (req, res) => {
    try {
        const { name, category, price, description, stock, vegan } = req.body;
        
        // Validation
        if (!name || !category || !price || !stock) {
            return res.status(400).send("Missing required fields");
        }
        
        const newFood = new Food({
            name: name.trim(),
            category: category.toLowerCase(),
            price: parseFloat(price),
            description: description || "",
            status: parseInt(stock) > 0 ? "Available" : "Unavailable",
            stock: parseInt(stock),
            vegan: vegan === "on",
            image: `/images/${name.toLowerCase().replace(/\s/g, '')}.png`
        });
        
        await newFood.save();
        res.redirect("/foodManagement");
    } catch (err) {
        console.error("Add food error:", err);
        res.status(500).send("Failed to add food item");
    }
};

// Update Food Item (U116)
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description, stock, vegan, status } = req.body;
        
        if (!id) {
            return res.status(400).send("Missing food ID");
        }
        
        const updateData = {
            name: name.trim(),
            category: category.toLowerCase(),
            price: parseFloat(price),
            description: description || "",
            status: status || (parseInt(stock) > 0 ? "Available" : "Unavailable"),
            stock: parseInt(stock),
            vegan: vegan === "on"
        };
        
        await Food.findByIdAndUpdate(id, updateData);
        res.redirect("/foodManagement");
    } catch (err) {
        console.error("Update food error:", err);
        res.status(500).send("Failed to update food item");
    }
};

// Delete Food Item (U116)
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).send("Missing food ID");
        }
        
        await Food.findByIdAndDelete(id);
        res.redirect("/foodManagement");
    } catch (err) {
        console.error("Delete food error:", err);
        res.status(500).send("Failed to delete food item");
    }
};

// API endpoint for testing
const getFoodsAPI = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (err) {
        console.error("Delete food error:", err);
        res.status(500).send("Failed to delete food item");
    }
};

module.exports = {
    getFoods,
    seedFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodsAPI
};