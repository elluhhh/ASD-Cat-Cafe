const Staff = require("../models/staffModel.js");

const findStaff = async (req, res) => {
	try {
		const {email, password} = req.body

        const staff = await Staff.findOne({
            email: email,
            password: password
        }).exec();

        if(staff == null){
            res.redirect("/staffLogin");
        }
		else {
            res.redirect("/");
        }
	} catch (err) {
		res.status(500).send(err);
	}
};

module.exports = {
	findStaff
};
