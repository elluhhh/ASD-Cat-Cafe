const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
//const bookingRoutes = require("./routes/bookingRoutes");
//onst catRoutes = require("./routes/catRoutes.js");
const adoptionRoutes = require("./routes/adoptionRoute"); 

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
//app.use("/cats", require("./routes/catRoute"));
//app.use("/bookingManagement", bookingRoutes);
//app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);

app.get('/catprofile', (req, res) => {
  res.render('catProfile'); 
});
app.get('/', (req, res) => res.redirect('/adoption/request'));

if (process.env.NODE_ENV !== "test") {
  const MONGO_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website";

  const PORT = process.env.PORT || 8000;

  (async () => {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log("DB is connected");

      app.listen(PORT, () =>
        console.log(`Server running at http://localhost:${PORT}/`)
      );
    } catch (err) {
      console.error("Startup error:", err);
      process.exit(1);
    }
  })();
}


module.exports = app;
//app.get('/', (req, res) => res.redirect('/adoption/request'));

// MongoDB connection
/*mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
  .then(() => console.log("DB is connected"))
  .catch(err => console.error("DB connection error", err)); 

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
    .then(() => console.log("DB is connected"))
    .catch(err => console.error("DB connection error", err));
}


// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000/");
  });
}*/

/*app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000/");
});

module.exports = app;*/