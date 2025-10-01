const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const app = express();

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/catcafe")
    .then(() => {})
    .catch(() => {});
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.get("/api/menu", async (_req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "data", "menu.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: "Failed to load menu data" });
  }
});

app.get("/", (_req, res) => res.render("index"));
app.get("/food", (_req, res) => res.render("food"));

app.use((_req, res) => res.status(404).send("Not Found"));

app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (req.path.startsWith("/api/")) return res.status(status).json({ error: message });
  return res.status(status).send(message);
});

module.exports = app;
