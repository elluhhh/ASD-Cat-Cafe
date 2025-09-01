import express from "express";
import cors from "cors";
// import cats from "./routes/cats.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5050;
const uri = process.env.ATLAS_URI || "";


// app.use(cors());
// app.use(express.json());
// app.use("/cats", cats);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

mongoose.connect(uri).then(()=> {
    console.log("DB is connected");
});

const catSchema = new mongoose.Schema({
    name: String,
    breed: String,
    colour: String,
    age: Number
});

const catModel = mongoose.model("cats", catSchema);

app.get("/cats", async(req, res) => {
    const catData = await catModel.find();
    res.json(catData);
});