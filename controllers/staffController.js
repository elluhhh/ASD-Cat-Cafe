const Staff = require("../models/staffModel.js");

const findStaff = async (req, res) => {
  try {
    const {email, password} = req.body;
    var errorMsg = "";

    const staff = await Staff.findOne({
      email: email,
      password: password
    }).exec();

    if(staff == null){
      errorMsg = "Incorrect login details. Try again.";
      res.render("staffLogin", {errorMsg});
    }
    else {
      res.render("staffDashboard", { staffName: staff.name });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  findStaff
};
