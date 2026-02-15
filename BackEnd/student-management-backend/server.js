const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sravs5414",
  database: "new_schema",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database...");
});


// ✅ 1️⃣ GET ALL Students
app.get("/student", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ✅ 2️⃣ GET Student By ID
app.get("/student/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM student WHERE StudentID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result[0]);
  });
});


// ✅ 3️⃣ ADD New Student
app.post("/student", (req, res) => {
  const { StudentName, StudentAge, StudentDept } = req.body;

  if (!StudentName || !StudentAge || !StudentDept) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const findMaxID = "SELECT MAX(StudentID) AS maxID FROM student";

  db.query(findMaxID, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const maxID = result[0].maxID || 0;
    const newStudentID = maxID + 1;

    const sql =
      "INSERT INTO student (StudentID, StudentName, StudentAge, StudentDept) VALUES (?, ?, ?, ?)";

    db.query(
      sql,
      [newStudentID, StudentName, StudentAge, StudentDept],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          message: "Student Added Successfully",
          StudentID: newStudentID,
        });
      }
    );
  });
});


// ✅ 4️⃣ PARTIAL UPDATE Student (PATCH)
app.patch("/student/:id", (req, res) => {
  const { id } = req.params;
  const { StudentName, StudentAge, StudentDept } = req.body;

  let fields = [];
  let values = [];

  if (StudentName !== undefined && StudentName !== "") {
    fields.push("StudentName = ?");
    values.push(StudentName);
  }

  if (StudentAge !== undefined && StudentAge !== "") {
    fields.push("StudentAge = ?");
    values.push(StudentAge);
  }

  if (StudentDept !== undefined && StudentDept !== "") {
    fields.push("StudentDept = ?");
    values.push(StudentDept);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  const sql = `UPDATE student SET ${fields.join(", ")} WHERE StudentID = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student updated successfully" });
  });
});


// ✅ 5️⃣ DELETE Student
app.delete("/student/:id", (req, res) => {
  const StudentID = req.params.id;

  if (!StudentID || isNaN(StudentID)) {
    return res.status(400).json({ error: "Invalid StudentID" });
  }

  const sql = "DELETE FROM student WHERE StudentID = ?";

  db.query(sql, [StudentID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student Deleted Successfully" });
  });
});


// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/student`);
});
