import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import { Alert, AlertTitle } from "@mui/material";
import Backbtn from "../../utils/Backbutton/backbutton";
import { motion } from "framer-motion";
import "./RegisterCourse.css";

// Ant Design components
import { Form, Input, Button, Spin, Typography } from "antd";
import { BookOutlined, NumberOutlined, UserOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function RegisterCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

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

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Render loading spinner during authentication check
  if (authLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text className="loading-text">Loading...</Text>
      </div>
    );
  }

  const handleRegisterCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const userId = auth.currentUser?.uid; // Get the logged-in user's ID
      if (!userId) {
        setAlert({
          type: "error",
          message: "You need to be logged in to register a course.",
        });
        return;
      }

      const courseRef = collection(db, "courses");
      const q = query(
        courseRef,
        where("userId", "==", userId),
        where("courseCode", "==", courseCode)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setAlert({
          type: "error",
          message: "A course with this code has already been registered!",
        });
      } else {
        await addDoc(courseRef, {
          userId: auth.currentUser?.uid,
          courseTitle,
          courseCode,
          classLevel,
          timeCreated: new Date().toISOString(),
        });

        setAlert({
          type: "success",
          message: "Course registered successfully!",
        });

        // Clear the input fields
        setCourseTitle("");
        setCourseCode("");
        setClassLevel("");
      }
    } catch (error) {
      console.error("Error registering course:", error);
      setAlert({
        type: "error",
        message:
          "An error occurred while registering the course. Please try again.",
      });
    } finally {
      setLoading(false);

      // Clear the alert message after 4 seconds
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 4000);
    }
  };

  return (
    <motion.div 
      className="course-registration-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="course-header"
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
              <BookOutlined style={{ marginRight: "10px" }} />
              Course Registration
            </Title>
            <Text className="header-subtitle">
              Add a new course to the biometric attendance system
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
          
          <form onSubmit={handleRegisterCourse} className="registration-form">
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="courseTitle">
                <BookOutlined className="input-icon" /> Course Title
              </label>
              <input
                type="text"
                id="courseTitle"
                placeholder="Example: Introduction to Computer Science"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
                className="form-input"
              />
            </motion.div>

            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="courseCode">
                <NumberOutlined className="input-icon" /> Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                placeholder="Example: CSC101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                required
                className="form-input"
              />
            </motion.div>

            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="classLevel">
                <UserOutlined className="input-icon" /> Class Level
              </label>
              <input
                type="text"
                id="classLevel"
                placeholder="Example: 200L"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value.toUpperCase())}
                required
                className="form-input"
              />
            </motion.div>

            <motion.button 
              type="submit" 
              disabled={loading}
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <>
                  <SaveOutlined style={{ marginRight: "8px" }} />
                  Register Course
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default RegisterCourse;
