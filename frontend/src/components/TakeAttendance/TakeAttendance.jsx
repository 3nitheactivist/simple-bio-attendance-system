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
  Paper,
} from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import { auth } from "../../utils/firebase/firebase";
import "../TakeAttendance/TakeAttendance.css";
import { Timestamp } from "firebase/firestore";
import Backbtn from "../../utils/Backbutton/backbutton";
import { motion } from "framer-motion";

// Import Ant Design Table component and its CSS
import { Table, Empty, Card } from "antd";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Define a time window (in hours) for which attendance records are valid/visible
  const attendanceWindowHours = 2; // Adjust this as needed

  // --- Fetch courses for the current user ---
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

  // --- Listen for attendance records for the selected course in the recent time window ---
  useEffect(() => {
    if (!selectedCourseId) return;

    const attendanceRef = collection(db, "attendance");
    const startTime = Timestamp.fromDate(
      new Date(Date.now() - attendanceWindowHours * 3600000)
    );
    const currentTime = Timestamp.fromDate(new Date());

    const q = query(
      attendanceRef,
      where("courseID", "==", selectedCourseId),
      where("timeMarked", ">=", startTime),
      where("timeMarked", "<=", currentTime)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const records = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendanceRecords(records);
      } else {
        setAttendanceRecords([]);
      }
    });

    return () => unsubscribe();
  }, [selectedCourseId, attendanceWindowHours]);

  // Establish WebSocket connection when the scanner dialog is open
  useEffect(() => {
    if (scannerDialogOpen) {
      // Use the environment variable or fallback to localhost
      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Connected to fingerprint scanner server at", wsUrl);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.fingerprintID) {
            console.log("Received fingerprint ID:", data.fingerprintID);
            setFingerprintInput(data.fingerprintID);
          }
        } catch (error) {
          console.error("Error parsing fingerprint data:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Clean up the WebSocket connection on component unmount
      return () => {
        ws.close();
      };
    }
  }, [scannerDialogOpen]);


  // --- Automatically mark attendance when a fingerprint is received ---
  useEffect(() => {
    if (scannerDialogOpen && fingerprintInput.trim() && !loading) {
      handleFingerprintInput();
    }
  }, [fingerprintInput, scannerDialogOpen, loading]);

  // --- Handle fingerprint input and mark attendance with optimistic update ---
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
        setFingerprintInput("");
        setScannerDialogOpen(false);
        return;
      }
      const studentData = studentSnap.docs[0].data();

      // Check if attendance is already marked for this student in the recent time window
      const startTime = Timestamp.fromDate(
        new Date(Date.now() - attendanceWindowHours * 3600000)
      );
      const attendanceRef = collection(db, "attendance");
      const attendanceQuery = query(
        attendanceRef,
        where("courseID", "==", selectedCourseId),
        where("fingerprintID", "==", fingerprintInput),
        where("timeMarked", ">=", startTime)
      );

      const attendanceSnap = await getDocs(attendanceQuery);
      if (!attendanceSnap.empty) {
        setError("Attendance already marked for this student.");
        setFingerprintInput("");
        setScannerDialogOpen(false);
        return;
      }

      // Add a new attendance record and get its reference
      const docRef = await addDoc(attendanceRef, {
        courseID: selectedCourseId,
        fingerprintID: studentData.fingerprintID,
        name: studentData.name,
        matricNumber: studentData.matricNumber,
        timeMarked: Timestamp.now(),
      });

      // Optimistically update the local attendance records immediately
      const newRecord = {
        id: docRef.id,
        courseID: selectedCourseId,
        fingerprintID: studentData.fingerprintID,
        name: studentData.name,
        matricNumber: studentData.matricNumber,
        timeMarked: Timestamp.now(),
      };
      setAttendanceRecords((prevRecords) => [newRecord, ...prevRecords]);

      setAttendanceStatus({
        success: true,
        message: `Attendance marked for ${studentData.name}`,
        student: studentData,
      });

      // Clear fingerprint input and close the scanner dialog
      setFingerprintInput("");
      setScannerDialogOpen(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Define columns for the Ant Design Table ---
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
      render: (text) => <span style={{ fontFamily: "monospace", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>{text}</span>
    },
    {
      title: "Time Marked",
      dataIndex: "timeMarked",
      key: "timeMarked",
      render: (timestamp) => {
        if (timestamp && timestamp.toDate) {
          return <span style={{ color: "#666" }}>{timestamp.toDate().toLocaleString()}</span>;
        }
        return "Invalid Date";
      },
    },
  ];

  // Find the selected course name for display
  const selectedCourseName = courses.find(course => course.id === selectedCourseId)?.courseTitle || '';
  const selectedCourseCode = courses.find(course => course.id === selectedCourseId)?.courseCode || '';

  return (
    <motion.div
      className="container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="header" variants={itemVariants}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <Backbtn />
          <motion.h1 
            className="title" 
            style={{ marginLeft: "10px" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Fingerprint Attendance
          </motion.h1>
        </div>
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
          className="attendance-button"
        >
          Take Attendance
        </Button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="error"
            className="alert"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      {attendanceStatus?.success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity="success"
            className="alert"
            onClose={() => setAttendanceStatus(null)}
          >
            {attendanceStatus.message}
          </Alert>
        </motion.div>
      )}

      <Dialog
        open={scannerDialogOpen}
        onClose={() => setScannerDialogOpen(false)}
        PaperProps={{
          style: {
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle style={{ backgroundColor: '#4b6cb7', color: 'white' }}>
          Fingerprint Attendance
        </DialogTitle>
        <DialogContent style={{ padding: '24px', paddingTop: '20px' }}>
          <div style={{ marginBottom: '12px', textAlign: 'center' }}>
            <IoFingerPrintOutline size={60} color="#4b6cb7" />
          </div>
          {selectedCourseName && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0', color: '#333' }}>{selectedCourseName}</h3>
              <p style={{ margin: '5px 0 0', color: '#666' }}>{selectedCourseCode}</p>
            </div>
          )}
          {/* Display the fingerprint ID (auto-populated) */}
          <TextField
            autoFocus
            margin="dense"
            label="Fingerprint ID"
            fullWidth
            variant="outlined"
            value={fingerprintInput}
            onChange={(e) => setFingerprintInput(e.target.value)}
            disabled
          />
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={() => setScannerDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          {/* Auto submission—no Submit button */}
        </DialogActions>
      </Dialog>

      <motion.div variants={itemVariants}>
        <Card 
          style={{ 
            borderRadius: '10px', 
            marginTop: '20px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >
          {selectedCourseId ? (
            attendanceRecords.length > 0 ? (
              <Table 
                dataSource={attendanceRecords} 
                columns={columns} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <Empty
                description="No attendance records found"
                style={{ padding: '40px 0' }}
              />
            )
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
              <Empty description="Please select a course to view attendance records" />
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TakeAttendance;
