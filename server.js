const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import routes
const foodRoutes = require("./routes/foodRoutes");
const menuRoutes = require("./routes/menuRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingManagementRoutes = require("./routes/bookingManagementRoutes");
const staffLoginRoutes = require("./routes/staffLoginRoutes");
const catRoutes = require("./routes/catRoutes");
const catProfileRoutes = require("./routes/catProfileRoutes");
const adoptionRoutes = require("./routes/adoptionRoute");
const adoptionRequestRoutes = require("./routes/adoptionRequestRoute");

const app = express();

// Connect to MongoDB (skip in test environment)
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

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Health check endpoint for testing
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// FOOD ROUTES - Order matters!
// 1. Staff management page (must come before /food API route)
app.use("/food/management", foodRoutes); // Staff food management
app.get("/foodManagement", (req, res) => res.redirect("/food/management")); // Legacy redirect

// 2. Customer food ordering page (renders the food.ejs page)
app.get("/food", (req, res) => {
  res.render("food"); // This shows the nice menu page for customers
});

// 3. API endpoints
app.use("/api/menu", menuRoutes); // JSON API for menu items
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// OTHER ROUTES
app.use("/checkout", checkoutRoutes);
app.use("/booking", bookingRoutes);
app.use("/bookingManagement", bookingManagementRoutes);
app.use("/staffLogin", staffLoginRoutes);
// Staff dashboard (after successful login)
app.get("/staffDashboard", (req, res) => {
  // In a real app, you'd check session authentication here
  res.render("staffDashboard", { staffName: "Staff Member" });
});
// Cat profile management PAGE (staff view)
app.get("/catprofile", (req, res) => {
  res.render("catProfile"); // Render the EJS page
});
// Cat routes for customer viewing
app.use("/cats", catRoutes); 
// Cat CRUD API (for the catProfile page to use via fetch)
app.use("/catprofile/api", catProfileRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/requests", adoptionRequestRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error:", err);
  res.status(status).send(message);
});

module.exports = app;