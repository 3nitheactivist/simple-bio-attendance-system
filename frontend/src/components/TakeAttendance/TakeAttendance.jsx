
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import {
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import { auth } from "../../utils/firebase/firebase";
import "../TakeAttendance/TakeAttendance.css";
import { Timestamp } from "firebase/firestore";

// Import Ant Design Table component and its CSS
import { Table } from "antd";

const TakeAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fingerprintInput, setFingerprintInput] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannerDialogOpen, setScannerDialogOpen] = useState(false);
  const currentUser = auth.currentUser;

  // --- Fetch courses from the "courses" collection ---

  // Define today's date range using Firestore Timestamp
  const today = new Date();
  const startOfDay = Timestamp.fromDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  );
  const endOfDay = Timestamp.fromDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  );
  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!currentUser) return;
      const coursesRef = collection(db, "courses");
      const q = query(coursesRef, where("userId", "==", currentUser.uid));
      try {
        const querySnapshot = await getDocs(q);
        const userCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(userCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchUserCourses();
  }, [currentUser]);

  // --- Listen for attendance records for the selected course for today ---
  // useEffect(() => {
  //   if (!selectedCourseId) return;

  //   // Define today's date range
  //   const today = new Date();
  //   const startOfDay = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   );
  //   const endOfDay = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate(),
  //     23,
  //     59,
  //     59,
  //     999
  //   );

  //   const attendanceRef = collection(db, "attendance");
  //   const q = query(
  //     attendanceRef,
  //     where("courseID", "==", selectedCourseId),
  //     where("timeMarked", ">=", startOfDay),
  //     where("timeMarked", "<=", endOfDay)
  //   );

  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const records = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setAttendanceRecords(records);
  //   });
  //   return () => unsubscribe();
  // }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;

    const attendanceRef = collection(db, "attendance");
    const q = query(
      attendanceRef,
      where("courseID", "==", selectedCourseId),
      where("timeMarked", ">=", startOfDay),
      where("timeMarked", "<=", endOfDay)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const records = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendanceRecords(records); // Ensure state updates correctly
      } else {
        setAttendanceRecords([]); // Ensure empty state clears previous data
      }
    });

    return () => unsubscribe();
  }, [selectedCourseId]);

  // --- Handle fingerprint input and mark attendance ---
  const handleFingerprintInput = async () => {
    if (!fingerprintInput.trim()) {
      setError("Please enter a fingerprint ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query the global "students" collection by fingerprintID
      const studentsRef = collection(db, "students");
      const studentQuery = query(
        studentsRef,
        where("fingerprintID", "==", fingerprintInput)
      );
      const studentSnap = await getDocs(studentQuery);
      if (studentSnap.empty) {
        setError("No student found with this fingerprint ID.");
        return;
      }
      const studentData = studentSnap.docs[0].data();

      // Check if attendance is already marked for this student today
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );
      const attendanceRef = collection(db, "attendance");
      const attendanceQuery = query(
        attendanceRef,
        where("courseID", "==", selectedCourseId),
        where("fingerprintID", "==", fingerprintInput), // Check per student
        where("timeMarked", ">=", startOfDay),
        where("timeMarked", "<=", endOfDay)
      );
      
      const attendanceSnap = await getDocs(attendanceQuery);
      if (!attendanceSnap.empty) {
        setError("Attendance already marked for this student.");
        return;
      }

      // Add a new attendance record as its own document
      await addDoc(attendanceRef, {
        courseID: selectedCourseId,
        fingerprintID: studentData.fingerprintID,
        name: studentData.name,
        matricNumber: studentData.matricNumber,
        timeMarked: Timestamp.now(), // Use Firestore Timestamp
      });

      setAttendanceStatus({
        success: true,
        message: `Attendance marked for ${studentData.name}`,
        student: studentData,
      });

      // Clear input and close the scanner dialog
      setFingerprintInput("");
      setScannerDialogOpen(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Define columns for Ant Design Table ---
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
    },
    {
      title: "Time Marked",
      dataIndex: "timeMarked",
      key: "timeMarked",
      render: (timestamp) => {
        if (timestamp && timestamp.toDate) {
          return timestamp.toDate().toLocaleString();
        }
        return "Invalid Date";
      },
    }
    ,
  ];

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Fingerprint Attendance</h1>
        <FormControl fullWidth variant="outlined" className="form-control">
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.courseTitle} ({course.courseCode})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<IoFingerPrintOutline />}
          onClick={() => setScannerDialogOpen(true)}
          disabled={!selectedCourseId}
        >
          Take Attendance
        </Button>
      </div>

      {error && (
        <Alert
          severity="error"
          className="alert"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {attendanceStatus?.success && (
        <Alert
          severity="success"
          className="alert"
          onClose={() => setAttendanceStatus(null)}
        >
          {attendanceStatus.message}
        </Alert>
      )}

      <Dialog
        open={scannerDialogOpen}
        onClose={() => setScannerDialogOpen(false)}
      >
        <DialogTitle>Fingerprint Attendance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Fingerprint ID"
            fullWidth
            variant="outlined"
            value={fingerprintInput}
            onChange={(e) => setFingerprintInput(e.target.value)}
          />
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScannerDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFingerprintInput}
            color="primary"
            disabled={loading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render attendance records using Ant Design Table */}
      <Table dataSource={attendanceRecords} columns={columns} rowKey="id" />
    </div>
  );
};

export default TakeAttendance;
