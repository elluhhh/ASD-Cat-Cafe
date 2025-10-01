const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());   
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/cats", require("./routes/catRoute"));

app.get('/catprofile', (req, res) => {
  res.render('catProfile');          
});

// MongoDB connection
/*mongoose
	.connect(
		"mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website"
	)
	.then(() => {
		console.log("DB is connected");
	});*/
  if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI ||
          'mongodb+srv://admin:cFBUZU6hozSWFbfk@cat-cafe-website.kycc7fg.mongodb.net/cat-cafe?retryWrites=true&w=majority&appName=cat-cafe-website'
      );
      console.log('DB is connected');
      app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
    } catch (err) {
      console.error('Startup error:', err);
      process.exit(1);
    }
  })();
}
module.exports = app; 

//app.use("/adoption", require("./routes/adoptionRoute"));

// Default
//app.get("/", (req, res) => res.redirect("/cats"));

/*const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});*/

