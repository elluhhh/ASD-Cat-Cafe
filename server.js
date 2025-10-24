const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

// Import routes
const foodRoutes = require("./routes/foodRoutes");
const menuRoutes = require("./routes/menuRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingManagementRoutes = require("./routes/bookingManagementRoutes");
const staffLoginRoutes = require("./routes/staffLoginRoutes");
const staffDashRoutes = require("./routes/staffDashRoutes");
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
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session middleware for cart/order routes
const cartSession = session({
  name: "cart.sid",
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60,
  },
});

// added: when user lands on /food while a checkout was in progress,
// just clear the session so the cart doesn't stay stuck
function clearOnFoodEnter(req, res, next) {
  if (req.session?.cartLocked) {
    req.session.cart = null;
    req.session.currentOrderId = null;
    req.session.cartLocked = false;
  }
  // also tell the browser not to reuse a cached page here (helps with back-forward cache)
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.set("Pragma", "no-cache");
  next();
}

// Health check endpoint for testing
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// 1. Staff management page (must come before /food API route)
app.use("/food/management", foodRoutes); // Staff food management
app.get("/foodManagement", (req, res) => res.redirect("/food/management")); // Legacy redirect

// Customer food ordering page (renders the food.ejs page)
// added: attach cartSession here so we can actually clear session on /food
app.get("/menu", cartSession, clearOnFoodEnter, (req, res) => {
  res.render("menu");
});

// API endpoints
app.use("/api/menu", menuRoutes);                  // JSON API for menu items
app.use("/api/cart", cartSession, cartRoutes);     // needs session
app.use("/api/orders", cartSession, orderRoutes);  // needs session

// OTHER ROUTES
app.use("/checkout", cartSession, checkoutRoutes); // needs session
app.use("/booking", bookingRoutes);
app.use("/bookingManagement", bookingManagementRoutes);
app.use("/staffLogin", staffLoginRoutes);
app.use("/staffDashboard", staffDashRoutes);

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
