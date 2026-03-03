require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

/* =========================
   ROUTES
========================= */

// GET all medicines
app.get("/api/medicines", (req, res) => {
  db.query("SELECT * FROM medicines", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// UPDATE stock
app.put("/api/medicines/:id", (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  db.query(
    "UPDATE medicines SET stock = ? WHERE id = ?",
    [stock, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Stock updated successfully" });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});