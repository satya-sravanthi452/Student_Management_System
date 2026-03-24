const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS (allow frontend)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ MySQL Connection (from ENV)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database...");
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ All your routes (same as yours)
app.get("/student", (req, res) => {
  db.query("SELECT * FROM student", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/student/:id", (req, res) => {
  db.query("SELECT * FROM student WHERE StudentID = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result[0]);
  });
});

app.post("/student", (req, res) => {
  const { StudentName, StudentAge, StudentDept } = req.body;

  if (!StudentName || !StudentAge || !StudentDept) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query("SELECT MAX(StudentID) AS maxID FROM student", (err, result) => {
    const newID = (result[0].maxID || 0) + 1;

    db.query(
      "INSERT INTO student VALUES (?, ?, ?, ?)",
      [newID, StudentName, StudentAge, StudentDept],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Added", StudentID: newID });
      }
    );
  });
});

app.patch("/student/:id", (req, res) => {
  const { StudentName, StudentAge, StudentDept } = req.body;

  let fields = [];
  let values = [];

  if (StudentName) { fields.push("StudentName=?"); values.push(StudentName); }
  if (StudentAge) { fields.push("StudentAge=?"); values.push(StudentAge); }
  if (StudentDept) { fields.push("StudentDept=?"); values.push(StudentDept); }

  if (!fields.length) return res.status(400).json({ error: "No fields" });

  values.push(req.params.id);

  db.query(`UPDATE student SET ${fields.join(",")} WHERE StudentID=?`, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Updated" });
  });
});

app.delete("/student/:id", (req, res) => {
  db.query("DELETE FROM student WHERE StudentID=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted" });
  });
});

// ✅ Use dynamic PORT (IMPORTANT for deployment)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
