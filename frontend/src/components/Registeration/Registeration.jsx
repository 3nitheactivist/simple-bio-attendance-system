import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoWhite.png";
import Sidebar from "../Sidebar/Sidebar";
import { IoIosFolderOpen } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";
import useAuth from "../../utils/config/useAuth";
import { auth } from "../../utils/firebase/firebase";
import Backbtn from "../../utils/Backbutton/backbutton";
import { motion } from "framer-motion";
import "./Registeration.css";

const Registeration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  // Card hover effect
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
      className="registration-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        className="registration-header"
        variants={itemVariants}
      >
        <div className="header-content">
          <motion.div 
            className="back-button-container"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Backbtn />
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
          className="header-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1>Choose Registration Option</h1>
          <p className="header-subtitle">Select the type of registration you want to perform</p>
        </motion.div>
      </motion.header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <motion.div 
        className="registration-options"
        variants={containerVariants}
      >
        {/* Register Course Button */}
        <motion.button 
          className="option-card" 
          onClick={() => navigate("/registerCourse")}
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
              <IoIosFolderOpen className="option-icon" />
            </div>
          </motion.div>
          <p className="option-title">Register Course</p>
          <p className="option-description">Add a new course to the system</p>
        </motion.button>

        {/* Register Student Button */}
        <motion.button 
          className="option-card" 
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
              <FaUserGraduate className="option-icon" />
            </div>
          </motion.div>
          <p className="option-title">Register Student</p>
          <p className="option-description">Add a new student with fingerprint</p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Registeration;
