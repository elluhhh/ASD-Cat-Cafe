const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//const bookingRoutes = require("./routes/bookingRoutes");
//const catRoutes = require("./routes/catRoutes.js");
const adoptionRoutes = require("../routes/adoptionRoute"); // ← ADD THIS
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
  .then(() => console.log("DB is connected"))
  .catch(err => console.error("DB connection error", err));

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//app.use("/bookingManagement", bookingRoutes);
//app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);

/*app.get("/", (req, res) => {
  res.render("index");
});
*/
app.get('/', (req, res) => res.redirect('/adoption/request'));

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/");
});

console.log('Views dir =', app.get('views'));