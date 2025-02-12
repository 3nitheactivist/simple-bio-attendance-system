import React, { useState, useEffect } from "react";
import "../Profile/Profile.css";
import { RiMenu3Line } from "react-icons/ri";
import Sidebar from "../Sidebar/Sidebar";
import logo from "../../assets/images/logoWhite.png";
import profileLogo from "../../assets/images/profile-ic2n.png";
import useAuth from "../../utils/config/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
// import { PulseLoader } from "react-spinners";

function Profile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [level, setLevel] = useState("");
  const [courseOfStudy, setCourseOfStudy] = useState("");


  // Fetch Profile Data on Load
  useEffect(() => { 
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = doc(db, "profile-update", currentUser.uid); // Replace 'users' with your collection name
          const snapshot = await getDoc(userDoc);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setLevel(data.level || ""); // Set fetched level
            setCourseOfStudy(data.courseOfStudy || ""); // Set fetched course of study
          } else {
            console.error("No profile data found for this user.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle Profile Update
  const handleUpdate = async () => {
    try {
      if (!currentUser?.uid) {
        alert("User not authenticated. Please log in.");
        return;
      }

      // Reference to the user's document in the database
      const userDoc = doc(db, "profile-update", currentUser.uid);

      // Set or update the document in Firestore
      await setDoc(
        userDoc,
        {
          level,
          courseOfStudy,
        },
        { merge: true } // Merge updates with existing data
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check console for details.");
    }
  };

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

      <div className="profile-tab">
        <p>USER'S PROFILE</p>

        <div className="profile-container">
          <img src={profileLogo} className="profile-logo" alt="Profile" />
        </div>

        <div className="profile-form">
          <h3>Email</h3>
          <span>{currentUser?.email || "No email available"}</span>

          <h3>Level</h3>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value.toUpperCase())}
            placeholder="Enter your level"
          />

          <h3>Course of Study</h3>
          <input
            type="text"
            value={courseOfStudy}
            onChange={(e) => setCourseOfStudy(e.target.value.toUpperCase())}
            placeholder="Enter your course of study"
          />

          <div>
            <button onClick={handleUpdate} className="update-button">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
