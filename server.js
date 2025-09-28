const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const bookingRoutes = require("./routes/bookingRoutes");
const catRoutes = require("./routes/catRoutes.js");
const adoptionRoutes = require("./routes/adoptionRoute"); 
require('dotenv').config();

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
  .then(() => console.log("DB is connected"))
  .catch(err => console.error("DB connection error", err));

// Routes
app.use("/bookingManagement", bookingRoutes);
app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/cats", require("./routes/catRoute"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get('/catprofile', (req, res) => {
  res.render('catProfile'); 
});

//app.get('/', (req, res) => res.redirect('/adoption/request'));

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/");
});