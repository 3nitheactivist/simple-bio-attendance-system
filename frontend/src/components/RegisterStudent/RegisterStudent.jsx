import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import Backbtn from "../../utils/Backbutton/backbutton";
import { db, auth } from "../../utils/firebase/firebase";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import "../RegisterStudent/RegisterStudent.css";
import { motion } from "framer-motion";

// Ant Design components
import { Spin, Typography, Badge } from "antd";
import { UserOutlined, IdcardOutlined, ScanOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// At the top of your file, you can define the WebSocket URL from your environment:
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";

function RegisterStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fingerprintID, setFingerprintID] = useState(null);
  const [formEnabled, setFormEnabled] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    matricNumber: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [authLoading, setAuthLoading] = useState(true);

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

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Create the WebSocket connection using the URL from the environment variable
  useEffect(() => {
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log("Connected to fingerprint scanner server");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.fingerprintID) {
          console.log("Received fingerprint ID:", data.fingerprintID);
          setFingerprintID(data.fingerprintID);
          setFormEnabled(true);
          setAlert({
            type: "success",
            message:
              "Fingerprint scanned successfully! Please complete the registration.",
          });
          // Clear the alert after 3 seconds
          setTimeout(() => setAlert({ type: "", message: "" }), 3000);
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
  }, [websocketUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setAlert({ type: "error", message: "You need to be logged in to register a student." });
        setTimeout(() => setAlert({ type: "", message: "" }), 3000);
        return;
      }

      if (!fingerprintID) {
        setAlert({ type: "error", message: "Please scan fingerprint before registering." });
        setTimeout(() => setAlert({ type: "", message: "" }), 3000);
        return;
      }

      // Reference to the global students collection
      const studentsRef = collection(db, "students");

      // Check if fingerprint ID already exists in the students collection
      const studentQuery = query(studentsRef, where("fingerprintID", "==", fingerprintID));
      const studentSnapshot = await getDocs(studentQuery);

      if (!studentSnapshot.empty) {
        setAlert({ type: "error", message: "This fingerprint ID is already registered." });
        setTimeout(() => setAlert({ type: "", message: "" }), 3000);
        return;
      }

      // Register the student in the students collection
      await addDoc(studentsRef, {
        name: studentData.name,
        matricNumber: studentData.matricNumber,
        fingerprintID,
        dateCreated: new Date().toISOString(),
        userId,
      });

      setAlert({ type: "success", message: "Student registered successfully!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);

      // Reset form and fingerprint data
      setStudentData({ name: "", matricNumber: "" });
      setFingerprintID(null);
      setFormEnabled(false);
    } catch (error) {
      console.error("Error registering student:", error);
      setAlert({
        type: "error",
        message: "An error occurred while registering the student. Please try again.",
      });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text className="loading-text">Loading...</Text>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="student-registration-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="student-header"
        variants={itemVariants}
      >
        <div className="header-content">
          <div className="back-button-container">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Backbtn />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Title level={2} className="page-title">
              <UserOutlined style={{ marginRight: "10px" }} />
              Student Registration
            </Title>
            <Text className="header-subtitle">
              Register a new student with fingerprint identification
            </Text>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="form-container" variants={itemVariants}>
        <motion.div 
          className="form-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleRegisterStudent} className="registration-form">
            {alert.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`alert ${alert.type}`}
              >
                <div className="alert-content">
                  <div className="alert-title">{alert.type === "success" ? "Success" : "Error"}</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="fingerprint-section"
              variants={itemVariants}
            >
              <div className="fingerprint-header">
                <ScanOutlined className="fingerprint-icon" />
                <Text className="fingerprint-title">Fingerprint Scan</Text>
              </div>
              
              <motion.div 
                className="fingerprint-status-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {fingerprintID ? (
                  <div className="fingerprint-success">
                    <Badge status="success" />
                    <span className="fingerprint-id">
                      Fingerprint ID: <strong>{fingerprintID}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="fingerprint-waiting">
                    <Badge status="processing" />
                    <span>Waiting for fingerprint scan...</span>
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
                      className="fingerprint-pulse"
                    >
                      <IoFingerPrintOutline size={60} />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            <div className="form-inputs">
              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <label htmlFor="name">
                  <UserOutlined className="input-icon" /> Student Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={studentData.name}
                  onChange={handleInputChange}
                  placeholder="Enter student's full name"
                  required
                  disabled={!formEnabled}
                  className="form-input"
                />
              </motion.div>

              <motion.div 
                className="form-group"
                variants={itemVariants}
              >
                <label htmlFor="matricNumber">
                  <IdcardOutlined className="input-icon" /> Matric Number
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  id="matricNumber"
                  value={studentData.matricNumber.toUpperCase()}
                  onChange={handleInputChange}
                  placeholder="Example: Y/ND/17378"
                  required
                  disabled={!formEnabled}
                  className="form-input"
                />
              </motion.div>
            </div>

            <motion.button 
              type="submit" 
              disabled={loading || !formEnabled}
              className="submit-button"
              whileHover={{ scale: formEnabled ? 1.02 : 1 }}
              whileTap={{ scale: formEnabled ? 0.98 : 1 }}
              variants={itemVariants}
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <>
                  <ScanOutlined style={{ marginRight: "8px" }} />
                  Register Student
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default RegisterStudent;
