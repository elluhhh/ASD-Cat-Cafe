const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes");
const foodRoutes = require("./routes/foodRoutes");
const catRoutes = require("./routes/catRoutes.js");

const app = express();

mongoose
	.connect(
		"mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website"
	)
	.then(() => {
		console.log("DB is connected");
	});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/bookingManagement", bookingRoutes);
app.use('/cat-display', catRoutes);

app.get("/", (req, res) => {
	res.render("index");
});

app.listen("8000");
