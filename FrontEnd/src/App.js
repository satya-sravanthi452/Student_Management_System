import React, { useEffect, useState } from "react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState("view");

  const [newStudent, setNewStudent] = useState({
    StudentName: "",
    StudentAge: "",
    StudentDept: "",
  });

  const [updateStudent, setUpdateStudent] = useState({
    StudentID: "",
    StudentName: "",
    StudentAge: "",
    StudentDept: "",
  });

  const [deleteID, setDeleteID] = useState("");

  // Fetch all students
  const fetchStudents = () => {
    fetch("http://localhost:5000/student")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ---------------- DELETE ----------------
  const handleDelete = () => {
    if (!deleteID) {
      alert("Student ID is required!");
      return;
    }

    fetch(`http://localhost:5000/student/${deleteID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed");
        return response.json();
      })
      .then(() => {
        fetchStudents();
        setDeleteID("");
        alert("Student deleted successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete student.");
      });
  };

  // ---------------- ADD ----------------
  const handleAddStudent = () => {
    if (!newStudent.StudentName.trim()) {
      alert("Student Name cannot be empty!");
      return;
    }

    fetch("http://localhost:5000/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then(() => {
        fetchStudents();
        setNewStudent({
          StudentName: "",
          StudentAge: "",
          StudentDept: "",
        });
        alert("Student added successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add student.");
      });
  };

  // ---------------- UPDATE (PARTIAL PATCH) ----------------
  const handleUpdateStudent = () => {
    if (!updateStudent.StudentID) {
      alert("Student ID is required!");
      return;
    }

    const updatedData = {};

    if (updateStudent.StudentName.trim() !== "") {
      updatedData.StudentName = updateStudent.StudentName;
    }

    if (updateStudent.StudentAge !== "") {
      updatedData.StudentAge = updateStudent.StudentAge;
    }

    if (updateStudent.StudentDept.trim() !== "") {
      updatedData.StudentDept = updateStudent.StudentDept;
    }

    if (Object.keys(updatedData).length === 0) {
      alert("Enter at least one field to update!");
      return;
    }

    fetch(`http://localhost:5000/student/${updateStudent.StudentID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Update failed");
        return response.json();
      })
      .then(() => {
        fetchStudents();
        setUpdateStudent({
          StudentID: "",
          StudentName: "",
          StudentAge: "",
          StudentDept: "",
        });
        alert("Student updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update student.");
      });
  };

  return (
    <div>
      <h2>Student Management</h2>

      {/* Navigation */}
      <div>
        {["view", "add", "delete", "update"].map((op) => (
          <label key={op} style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value={op}
              checked={selectedOperation === op}
              onChange={() => setSelectedOperation(op)}
            />
            {op.charAt(0).toUpperCase() + op.slice(1)} Student
          </label>
        ))}
      </div>

      {/* VIEW */}
      {selectedOperation === "view" && (
        <div>
          <h3 align="center">Student List</h3>
          <table border="2" width="600" align="center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.StudentID}>
                  <td>{stu.StudentID}</td>
                  <td>{stu.StudentName}</td>
                  <td>{stu.StudentAge}</td>
                  <td>{stu.StudentDept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD */}
      {selectedOperation === "add" && (
        <div align="center">
          <h3>Add Student</h3>
          <input
            type="text"
            placeholder="Name"
            value={newStudent.StudentName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, StudentName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            value={newStudent.StudentAge}
            onChange={(e) =>
              setNewStudent({ ...newStudent, StudentAge: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department"
            value={newStudent.StudentDept}
            onChange={(e) =>
              setNewStudent({ ...newStudent, StudentDept: e.target.value })
            }
          />
          <br />
          <button onClick={handleAddStudent}>Add Student</button>
        </div>
      )}

      {/* DELETE */}
      {selectedOperation === "delete" && (
        <div align="center">
          <h3>Delete Student</h3>
          <input
            type="number"
            placeholder="Enter Student ID"
            value={deleteID}
            onChange={(e) => setDeleteID(e.target.value)}
          />
          <br />
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      {/* UPDATE */}
      {selectedOperation === "update" && (
        <div align="center">
          <h3>Update Student</h3>
          <input
            type="number"
            placeholder="Student ID (Required)"
            value={updateStudent.StudentID}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                StudentID: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="New Name (Optional)"
            value={updateStudent.StudentName}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                StudentName: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="New Age (Optional)"
            value={updateStudent.StudentAge}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                StudentAge: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="New Department (Optional)"
            value={updateStudent.StudentDept}
            onChange={(e) =>
              setUpdateStudent({
                ...updateStudent,
                StudentDept: e.target.value,
              })
            }
          />
          <br />
          <button onClick={handleUpdateStudent}>Update Student</button>
        </div>
      )}
    </div>
  );
};

export default StudentList;
