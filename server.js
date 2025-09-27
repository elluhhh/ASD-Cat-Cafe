import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static("public"));

// implement ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/api/menu", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "data", "menu.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load menu data" });
  }
});

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs
});

app.get("/food", (req, res) =>{
  res.render("food"); //views/food.ejs
});

//const PORT = process.env.PORT || 8080;
//app.listen(PORT, () => {
//  console.log(`Server running at http://localhost:${PORT}`);
//});

export default app;
