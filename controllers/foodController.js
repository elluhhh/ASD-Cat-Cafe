const path = require("path");
const fs = require("fs");

exports.getMenu = (req, res) => {
  const filePath = path.join(__dirname, "../data/menu.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read menu.json:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const menu = JSON.parse(data);
      res.json(menu);
    } catch (parseErr) {
      console.error("Invalid JSON in menu.json:", parseErr);
      res.status(500).json({ error: "Menu data corrupted" });
    }
  });
};