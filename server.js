const express = require("express");
const bodyParser = require("body-parser");
const catRoutes = require("./routes/catRoutes.js");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/cat-display', catRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server is running at host http://localhost:${PORT}`);
});
