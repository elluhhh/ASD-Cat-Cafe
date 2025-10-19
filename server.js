const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const favicon = require("serve-favicon");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingManagementRoutes = require("./routes/bookingManagementRoutes");
const catRoutes = require("./routes/catRoutes.js");
const checkoutRoutes = require('./routes/checkoutRoutes');
const adoptionRoutes = require("./routes/adoptionRoute"); 
const adoptionRequestRoutes = require("./routes/adoptionRequestRoute.js");
const staffLoginRoutes = require("./routes/staffLoginRoutes.js");
require('dotenv').config();

const app = express();

// Middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website")
    .then(() => console.log("DB is connected"))
    .catch(err => console.error("DB connection error", err));
}

// Routes
app.use("/bookingManagement", bookingManagementRoutes);
app.use("/booking", bookingRoutes);
app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/requests", adoptionRequestRoutes);
app.use("/cats", require("./routes/catProfileRoutes.js"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use('/checkout', checkoutRoutes);
app.use("/staffLogin", staffLoginRoutes);

app.get("/", (req, res) => {
  res.render("index");
});
app.get('/catprofile', (req, res) => {
  res.render('catProfile'); 
});
app.get("/food", (_req, res) => res.render("food"));

app.get('/', (req, res) => res.redirect('/adoption/request'));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.get("/api/menu", async (_req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "data", "menu.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: "Failed to load menu data" });
  }
});

app.use((_req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (req.path.startsWith("/api/")) return res.status(status).json({ error: message });
  return res.status(status).send(message);
});

module.exports = app;