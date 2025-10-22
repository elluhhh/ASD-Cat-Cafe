const express = require("express");
const router = express.Router();

router.get("/:staffName", (req, res) => {
    res.render("staffDashboard", { staffName: req.params.staffName});
});

router.get("/", (req, res) => {
    res.render("staffDashboard", {staffName: "Example Staff"});
});

module.exports = router;