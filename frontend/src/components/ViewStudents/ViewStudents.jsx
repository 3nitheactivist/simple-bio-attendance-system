
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { useLocation } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import Backbtn from "../../utils/Backbutton/backbutton";

function ViewStudents() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");
  const courseTitle = searchParams.get("courseTitle");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      setLoading(true);
      try {
        if (!courseId) {
          throw new Error("Invalid course ID");
        }

        const enrollmentsRef = collection(db, `course/${courseId}/enrollments`);
        const querySnapshot = await getDocs(enrollmentsRef);

        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [courseId]);

  return (
    <div className="container-2">
      <div className="head">
        <div className="head-text">
          <Backbtn />
          <h1>Enrolled Students - {courseTitle}</h1>
        </div>
      </div>

      <div className="vc-table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : students.length > 0 ? (
          <Paper className="vc-table">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Matric Number</TableCell>
                    <TableCell>Fingerprint ID</TableCell>
                    <TableCell>Date Enrolled</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.matricNumber}</TableCell>
                      <TableCell>{student.fingerprintID}</TableCell>
                      <TableCell>{new Date(student.dateCreated).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>No students enrolled in this course.</p>
        )}
      </div>
    </div>
  );
}

export default ViewStudents;
