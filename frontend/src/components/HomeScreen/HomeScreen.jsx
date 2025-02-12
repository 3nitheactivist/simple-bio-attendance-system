import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";
import logo from "../../assets/images/logoWhite.png";
import attendanceLogo from "../../assets/images/attendance1.png";
import viewAttendance from "../../assets/images/view-attend.png";
import { RiMenu3Line } from "react-icons/ri";
import Sidebar from "../Sidebar/Sidebar";
import { IoIosFolderOpen } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";
import { FaAddressBook } from "react-icons/fa";
import useAuth from "../../utils/config/useAuth";
import { auth } from "../../utils/firebase/firebase";
import BluetoothButton from "../BluetoothButton/BluetoothButton";

const HomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); // React Router navigation hook

  const { currentUser } = useAuth();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("Current User:", auth.currentUser);

  return (
    <div className="container1">
      <header className="transparent-container">
        <div className="nav-data">
          <div className="rando-text">he</div>
          <img
            src={logo}
            alt="Yaba College of Technology Logo"
            className="logo-main"
          />
          
          <div className="menu-bar">
            <RiMenu3Line onClick={toggleSidebar} className="menu-icon" />
          </div>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="display-message"><h1>Welcome, {currentUser?.displayName}.👋 </h1></div>
      <div className="menu-grid">
        {/* Register Student Button */}
        <button className="menu-item" onClick={() => navigate("/viewCourses")}>
          <IoIosFolderOpen  className="logo1" />
          <p className="p-title">View Course</p>
        </button>

        {/* Register Course Button */}
        <button className="menu-item" onClick={() => navigate("/registration")}>
          <FaAddressBook className="logo2" />
          <p className="p-title">Registeration</p>
        </button>

        {/* Take Attendance Button */}
        <button className="menu-item" onClick={() => navigate("/takeAttendance")}>
          <img src={attendanceLogo} alt="Take Attendance" className="logo3" />
          <p className="p-title">Take Attendance</p>
        </button>

        {/* View Attendance Button */}
        <button className="menu-item" onClick={() => navigate("/viewAttendance")}>
          <img src={viewAttendance} alt="View Attendance" className="logo4" />
          <p className="p-title">View Attendance</p>
        </button>
      </div>

      <BluetoothButton></BluetoothButton>
    </div>
  );
};

export default HomeScreen;
