import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import { Alert, AlertTitle } from "@mui/material";
import { PulseLoader } from "react-spinners";
import image from "../../assets/images/white 1.png";
import Backbtn from "../../utils/Backbutton/backbutton";
function RegisterCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

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
    return <div>Loading...</div>;
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
        // Debugging - Log data being sent to Firestore
        console.log("Adding course with data:", {
          userId: auth.currentUser?.uid,
          courseTitle,
          courseCode,
          classLevel,
          timeCreated: new Date().toISOString(),
        });

        // Add new course with an auto-generated ID
        await addDoc(courseRef, {
          userId: auth.currentUser?.uid, // Associate the course with the user's ID
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

        // setTimeout(() => navigate("/dashboard"), 2000);
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
    <div className="container">
      <img src={image} alt="Logo" className="logo-1" />

      <form onSubmit={handleRegisterCourse} className="Regform">
        <Backbtn />

        <div className="title">COURSE REGISTRATION</div>

        {alert.message && (
          <Alert severity={alert.type} style={{ marginBottom: "1rem" }}>
            <AlertTitle>
              {alert.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            {alert.message}
          </Alert>
        )}

        <label htmlFor="courseTitle">Enter Course Title</label>
        <input
          type="text"
          placeholder="Sample: Introduction to Roblox"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          required
        />

        <label htmlFor="courseCode">Enter Course Code</label>
        <input
          type="text"
          placeholder="Sample: EEE123"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
          required
        />

        <label htmlFor="classLevel">Enter Class Level</label>
        <input
          type="text"
          placeholder="Sample: 200L"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value.toUpperCase())}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <PulseLoader color="#28a745" size={8} /> : "Save Data"}
        </button>
      </form>
    </div>
  );
}

export default RegisterCourse;
