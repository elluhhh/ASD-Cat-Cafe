const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const foodRoutes = require("./routes/foodRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

const app = express();

// Only connect to DB if not in test mode
if (process.env.NODE_ENV !== "test") {
    mongoose
        .connect(
            "mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website"
        )
        .then(() => {
            console.log("DB is connected");
        })
        .catch((err) => {
            console.error("DB connection error:", err);
        });
}

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Health check endpoint for testing
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Routes
app.use("/foodManagement", foodRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Not Found");
});

// Error handler
app.use((err, req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).send(message);
});

// Export for testing (this is correct)
module.exports = app;