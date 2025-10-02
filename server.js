const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs").promises;
const bookingRoutes = require("./routes/bookingRoutes");
const catRoutes = require("./routes/catRoutes.js");
const adoptionRoutes = require("./routes/adoptionRoute"); 
const adoptionRequestRoutes = require("./routes/adoptionRequestRoute.js"); 
require('dotenv').config();

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
    .then(() => console.log("DB is connected"))
    .catch(err => console.error("DB connection error", err));
}

// Routes
app.use("/bookingManagement", bookingRoutes);
app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/requests", adoptionRequestRoutes);
app.use("/cats", require("./routes/catRoute"));
app.use("/api/cart", require("./routes/cartRoutes"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get('/catprofile', (req, res) => {
  res.render('catProfile'); 
});
app.get("/food", (_req, res) => res.render("food"));

//app.get('/', (req, res) => res.redirect('/adoption/request'));

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