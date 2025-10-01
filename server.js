const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

// const bookingRoutes = require("./routes/bookingRoutes");
// const catRoutes = require("./routes/catRoutes.js");
const adoptionRoutes = require("./main/routes/adoptionRoute"); // ← ADD THIS

const app = express();

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
    .then(() => console.log("DB is connected"))
    .catch((err) => console.error("DB connection error", err));
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/adoption/static", express.static(path.join(__dirname, "main", "adoption")));

// implement ejs
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "main", "views"),
]);

// app.use("/bookingManagement", bookingRoutes);
// app.use("/cats", catRoutes);
app.use("/adoption", adoptionRoutes);

// add for automated testing
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/menu", async (_req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "data", "menu.json"),
      "utf-8"
    );
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load menu data" });
  }
});

/* app.get("/", (req, res) => {
  res.render("index");
}); */

app.get("/", (_req, res) => {
  res.render("index"); // views/index.ejs
});

app.get("/food", (_req, res) => {
  res.render("food"); // views/food.ejs
});

console.log("Views dir =", app.get("views"));

app.use((_req, res) => res.status(404).send("Not Found"));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

module.exports = app;

