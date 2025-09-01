import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5050;
const uri = process.env.ATLAS_URI || "";

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

//connect to db
mongoose.connect(uri).then(()=> {
    console.log("DB is connected");
});

//trial get req
//cat schema
const catSchema = new mongoose.Schema({
    name: String,
    breed: String,
    colour: String,
    age: Number
});

const catModel = mongoose.model("cats", catSchema);

//gets data from database
app.get("/cats", async(req, res) => {
    const catData = await catModel.find();
    res.json(catData);
});