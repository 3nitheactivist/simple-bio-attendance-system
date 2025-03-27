import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import Backbtn from "../../utils/Backbutton/backbutton";
import { db } from "../../utils/firebase/firebase";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import "../RegisterStudent/RegisterStudent.css";
import { motion } from "framer-motion";

// Ant Design components
import { Spin, Typography, Badge, Form, Avatar, Button } from "antd";
import { UserOutlined, IdcardOutlined, ScanOutlined, CameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// At the top of your file, you can define the WebSocket URL from your environment:
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";

function RegisterStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fingerprintID, setFingerprintID] = useState("");
  const [studentData, setStudentData] = useState({
    name: "",
    matricNumber: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formEnabled, setFormEnabled] = useState(false);

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

  // Re-enable WebSocket connection
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
          setFormEnabled(true); // Enable form when ID is received
          setAlert({
            type: "success",
            message: "Fingerprint scanned successfully! Please complete the registration.",
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
      setAlert({
        type: "error",
        message: "Connection error. Please try again.",
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fingerprintID') {
      setFingerprintID(value);
    } else {
      setStudentData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      // Basic validation
      if (!fingerprintID || !studentData.name || !studentData.matricNumber) {
        setAlert({ type: "error", message: "Please fill in all required fields." });
        return;
      }

      // Reference to the global students collection
      const studentsRef = collection(db, "students");

      // Check if fingerprint ID already exists
      const studentQuery = query(studentsRef, where("fingerprintID", "==", fingerprintID));
      const studentSnapshot = await getDocs(studentQuery);

      if (!studentSnapshot.empty) {
        setAlert({ type: "error", message: "This fingerprint ID is already registered." });
        return;
      }

      // Prepare student data
      const studentDataToSave = {
        name: studentData.name,
        matricNumber: studentData.matricNumber.toUpperCase(),
        fingerprintID,
        dateCreated: new Date().toISOString(),
      };

      // Add image if available
      if (imageFile && imagePreview) {
        studentDataToSave.profileImage = {
          data: imagePreview,
          uploaded: new Date().toISOString()
        };
      }

      // Register the student
      await addDoc(studentsRef, studentDataToSave);

      setAlert({ type: "success", message: "Student registered successfully!" });

      // Reset form
      setStudentData({ name: "", matricNumber: "" });
      setFingerprintID("");
      setImageFile(null);
      setImagePreview(null);

      // Optional: Navigate back or to another page after successful registration
      // navigate('/some-path');
      
    } catch (error) {
      console.error("Error registering student:", error);
      setAlert({
        type: "error",
        message: "An error occurred while registering the student. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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

            {/* Manual Fingerprint ID Input */}
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="fingerprintID">
                <IoFingerPrintOutline className="input-icon" /> Fingerprint ID
              </label>
              <input
                type="text"
                name="fingerprintID"
                id="fingerprintID"
                value={fingerprintID}
                readOnly
                placeholder="Waiting for fingerprint scan..."
                required
                className="form-input"
              />
            </motion.div>

            {/* Student Details */}
            <div className="form-inputs">
              <motion.div className="form-group" variants={itemVariants}>
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

              <motion.div className="form-group" variants={itemVariants}>
                <label htmlFor="matricNumber">
                  <IdcardOutlined className="input-icon" /> Matric Number
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  id="matricNumber"
                  value={studentData.matricNumber}
                  onChange={handleInputChange}
                  placeholder="Example: Y/ND/17378"
                  required
                  disabled={!formEnabled}
                  className="form-input"
                />
              </motion.div>
            </div>

            {/* Photo Upload Section */}
            <Form.Item label="Student Photo">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <Avatar 
                    size={104} 
                    icon={<UserOutlined />} 
                    src={imagePreview}
                    style={{ 
                      backgroundColor: '#4CAF50',
                      cursor: formEnabled ? 'pointer' : 'not-allowed',
                      border: '1px dashed #d9d9d9',
                      opacity: formEnabled ? 1 : 0.6,
                    }} 
                    onClick={() => formEnabled && fileInputRef.current?.click()}
                  />
                  <Button
                    shape="circle"
                    icon={<CameraOutlined />}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      border: "none",
                      opacity: formEnabled ? 1 : 0.6,
                    }}
                    disabled={!formEnabled}
                    onClick={() => formEnabled && fileInputRef.current?.click()}
                  />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  disabled={!formEnabled}
                  onChange={(e) => {
                    if (!formEnabled) return;
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    if (file.size > 2 * 1024 * 1024) {
                      setAlert({ type: 'error', message: 'Image must be smaller than 2MB!' });
                      return;
                    }
                    
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImagePreview(event.target.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                
                {imageFile && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontWeight: 'bold' }}>{imageFile.name}</span>
                    <span style={{ color: '#888' }}> - {(imageFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            </Form.Item>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              disabled={loading || !formEnabled}
              className="submit-button"
              whileHover={{ scale: formEnabled ? 1.02 : 1 }}
              whileTap={{ scale: formEnabled ? 0.98 : 1 }}
              variants={itemVariants}
              style={{ 
                opacity: formEnabled ? 1 : 0.6
              }}
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
