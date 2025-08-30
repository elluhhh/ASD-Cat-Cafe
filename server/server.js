import express from "express";
import cors from "cors";
import cats from "./routes/cats.js";

const PORT = process.env.PORT || 5050;
const uri = process.env.ATLAS_URI || "";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/cats", cats);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});