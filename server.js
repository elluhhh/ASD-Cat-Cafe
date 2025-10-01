const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();

app.use(express.json());
app.use(express.static("public"));

// implement ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// add for automated testing
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/menu", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "data", "menu.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load menu data" });
  }
});

app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs
});

app.get("/food", (req, res) => {
  res.render("food"); // views/food.ejs
});

app.use((req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

module.exports = app;   
