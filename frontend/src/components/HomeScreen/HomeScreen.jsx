import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";
import logo from "../../assets/images/logoWhite.png";
import attendanceLogo from "../../assets/images/attendance1.png";
import viewAttendance from "../../assets/images/view-attend.png";
import { FaBars } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
import { FaAddressBook } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import BluetoothButton from "../BluetoothButton/BluetoothButton";
import { motion } from "framer-motion";

// Ant Design components
import { Badge, Tooltip } from "antd";
import { IoFingerPrintOutline } from "react-icons/io5";

const HomeScreen = () => {
  const navigate = useNavigate(); // React Router navigation hook

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  // Custom card hover effect
  const cardHoverEffect = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: { 
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div 
      className="dashboard-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        className="dashboard-header"
        variants={itemVariants}
      >
        <div className="header-top">
          <motion.div 
            className="menu-icon-container"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBars className="menu-icon" />
          </motion.div>
          
          <motion.div 
            className="logo-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={logo}
              alt="Yaba College of Technology Logo"
              className="logo-main"
            />
          </motion.div>
        </div>

        <motion.div 
          className="welcome-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1>
            Welcome, User
            <motion.span
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ display: "inline-block", marginLeft: "10px" }}
            >
              👋
            </motion.span>
          </h1>
          <motion.p 
            className="dashboard-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Biometric Attendance Management System
          </motion.p>
        </motion.div>
      </motion.header>

          
      <motion.div 
        className="menu-grid"
        variants={containerVariants}
      >
       
        {/* Registration Button */}
        <motion.button 
          className="menu-card" 
          onClick={() => navigate("/registerStudent")}
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          animate="rest"
        >
          <motion.div 
            className="icon-wrapper"
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="icon-bg">
              <FaAddressBook className="menu-icon-card" />
            </div>
          </motion.div>
          <p className="menu-title">Student Registration</p>
        </motion.button>

        {/* Take Attendance Button */}
        <motion.button 
          className="menu-card" 
          onClick={() => navigate("/takeAttendance")}
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          animate="rest"
        >
          <motion.div 
            className="icon-wrapper"
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="icon-bg">
              <IoFingerPrintOutline className="menu-icon-card" />
            </div>
          </motion.div>
          <p className="menu-title">Take Attendance</p>
        </motion.button>




      </motion.div>

      <motion.div 
        className="bluetooth-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <BluetoothButton />
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
