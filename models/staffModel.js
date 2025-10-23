//Ella Gibbs
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;