
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoWhite.png";
import Sidebar from "../Sidebar/Sidebar";
import { IoIosFolderOpen } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";
import useAuth from "../../utils/config/useAuth";
import { auth } from "../../utils/firebase/firebase";
import Backbtn from "../../utils/Backbutton/backbutton";

const Registeration = () => {
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
          <div className="rando-text">##1</div>
          <img
            src={logo}
            alt="Yaba College of Technology Logo"
            className="logo-main"
          />
          
          <div className="menu-bar">
            {/* <RiMenu3Line onClick={toggleSidebar} className="menu-icon" />
             */}
             <Backbtn />
          </div>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="display-message"><h1>Choose Registeration Option. </h1></div>
      <div className="menu-grid">
        {/* Register Student Button */}
        <button className="menu-item" onClick={() => navigate("/registerCourse")}>
          <IoIosFolderOpen  className="logo1" />
          <p className="p-title">Register Course</p>
        </button>

        {/* Register Course Button */}
        <button className="menu-item" onClick={() => navigate("/registerStudent")}>
          <FaUserGraduate className="logo2" />
          <p className="p-title">Register Student</p>
        </button>
      </div>
    </div>
  );
};

export default Registeration;
