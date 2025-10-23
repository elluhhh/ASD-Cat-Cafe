//Ella Gibbs
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("staffDashboard", {staffName: "Example Staff"});
});

module.exports = router;