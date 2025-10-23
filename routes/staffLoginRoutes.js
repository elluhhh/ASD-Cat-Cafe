//Ella Gibbs
const express = require("express");
const {
  findStaff
} = require("../controllers/staffController.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("staffLogin", { errorMsg: "" });
});

router.post("/", findStaff);

module.exports = router;