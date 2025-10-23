const Staff = require("../models/staffModel.js");

const findStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({
      email: email,
      password: password
    }).exec();

    if (staff == null) {
      const errorMsg = "Incorrect login details. Try again.";
      return res.render("staffLogin", { errorMsg });
    } else {
      return res.render("staffDashboard", { staffName: staff.name });
    }
  } catch (err) {
    console.error("Staff login error:", err);
    return res.status(500).send(err);
  }
};

module.exports = {
  findStaff
};
