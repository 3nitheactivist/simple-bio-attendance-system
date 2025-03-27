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
import "../TakeAttendance/TakeAttendance.css";
import { Timestamp } from "firebase/firestore";
import Backbtn from "../../utils/Backbutton/backbutton";
import { motion } from "framer-motion";

// Import Ant Design Table component and its CSS
import { Table, Empty, Card, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

// Add this line near the top of the file, after imports
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";

const TakeAttendance = () => {
  const [fingerprintInput, setFingerprintInput] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannerDialogOpen, setScannerDialogOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState([]);

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

  // --- Fetch courses ---
  useEffect(() => {
    const fetchUserCourses = async () => {
      const coursesRef = collection(db, "courses");
      try {
        const querySnapshot = await getDocs(coursesRef);
        const userCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Error fetching courses");
      }
    };
    fetchUserCourses();
  }, []);

  // --- Listen for attendance records for the selected course in the recent time window ---
  useEffect(() => {
    const attendanceRef = collection(db, "attendance");
    const startTime = Timestamp.fromDate(
      new Date(Date.now() - attendanceWindowHours * 3600000)
    );
    const currentTime = Timestamp.fromDate(new Date());

    const q = query(
      attendanceRef,
      where("timeMarked", ">=", startTime),
      where("timeMarked", "<=", currentTime)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const records = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
      }
    });

    return () => unsubscribe();
  }, [attendanceWindowHours]);

  // Fetch student's attendance records when studentData changes
  useEffect(() => {
    if (studentData?.fingerprintID) {
      const fetchAttendance = async () => {
        const attendanceRef = collection(db, "attendance");
        const q = query(
          attendanceRef,
          where("fingerprintID", "==", studentData.fingerprintID),
          where("timeMarked", ">=", Timestamp.fromDate(new Date(Date.now() - 24 * 3600000))) // Last 24 hours
        );
        
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudentAttendance(records);
      };
      
      fetchAttendance();
    }
  }, [studentData]);

  // Update WebSocket connection in dialog
  useEffect(() => {
    if (scannerDialogOpen) {
      const ws = new WebSocket(websocketUrl);

      ws.onopen = () => {
        console.log("Connected to fingerprint scanner server");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.fingerprintID) {
            console.log("Received fingerprint ID:", data.fingerprintID);
            setFingerprintInput(data.fingerprintID);
            // Automatically trigger attendance marking when ID is received
            handleFingerprintInput(data.fingerprintID);
          }
        } catch (error) {
          console.error("Error parsing fingerprint data:", error);
          setError("Error reading fingerprint");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Connection error. Please try again.");
      };

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

  // Update the handleFingerprintInput to accept ID parameter
  const handleFingerprintInput = async (receivedId) => {
    const fingerprintToUse = receivedId || fingerprintInput;
    if (!fingerprintToUse.trim()) {
      setError("No fingerprint ID received");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query the global "students" collection by fingerprintID
      const studentsRef = collection(db, "students");
      const studentQuery = query(
        studentsRef,
        where("fingerprintID", "==", fingerprintToUse)
      );
      const studentSnap = await getDocs(studentQuery);
      if (studentSnap.empty) {
        setError("No student found with this fingerprint ID.");
        setFingerprintInput("");
        setScannerDialogOpen(false);
        return;
      }
      const foundStudentData = studentSnap.docs[0].data();
      setStudentData(foundStudentData);

      // Add attendance record
      const attendanceRef = collection(db, "attendance");
      const docRef = await addDoc(attendanceRef, {
        fingerprintID: foundStudentData.fingerprintID,
        name: foundStudentData.name,
        matricNumber: foundStudentData.matricNumber,
        timeMarked: Timestamp.now(),
        profileImage: foundStudentData.profileImage || null,
      });

      setAttendanceStatus({
        success: true,
        message: `Attendance marked for ${foundStudentData.name}`,
        student: foundStudentData,
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

        {/* Take Attendance Button - No longer disabled */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoFingerPrintOutline />}
          onClick={() => setScannerDialogOpen(true)}
          className="attendance-button"
        >
          Take Attendance
        </Button>
      </motion.div>

      {/* Student Info Card with Attendance History */}
      {studentData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ margin: '20px', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '30px' }}>
              {/* Student Details */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: 1 }}>
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  src={studentData.profileImage?.data}
                  style={{ backgroundColor: '#00923F' }}
                />
                <div>
                  <h2 style={{ margin: '0 0 8px 0', color: '#333' }}>{studentData.name}</h2>
                  <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>Matric Number: {studentData.matricNumber}</p>
                  <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>ID: {studentData.fingerprintID}</p>
                </div>
              </div>

              {/* Attendance History */}
              <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px', minWidth: '300px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Recent Attendance</h3>
                {studentAttendance.map((record, index) => (
                  <div 
                    key={record.id} 
                    style={{ 
                      marginBottom: '8px',
                      padding: '8px',
                      backgroundColor: index === 0 ? '#f6ffed' : 'transparent',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ color: index === 0 ? '#52c41a' : '#666', fontSize: '14px' }}>
                      {record.timeMarked.toDate().toLocaleString()}
                    </div>
                  </div>
                ))}
                {studentAttendance.length === 0 && (
                  <Empty description="No recent attendance records" />
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

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
          Scan Fingerprint
        </DialogTitle>
        <DialogContent style={{ padding: '24px', paddingTop: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            >
              <IoFingerPrintOutline size={80} color="#4b6cb7" />
            </motion.div>
            <p style={{ marginTop: '20px', color: '#666' }}>
              Please place your finger on the scanner
            </p>
            {loading && (
              <CircularProgress style={{ marginTop: '20px' }} />
            )}
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={() => setScannerDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default TakeAttendance;
