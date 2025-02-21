import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import Backbtn from "../../utils/Backbutton/backbutton";
import { db, auth } from "../../utils/firebase/firebase";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import "../RegisterStudent/RegisterStudent.css";
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

  // // Create WebSocket connection to receive real fingerprint data
  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8080");

  //   ws.onopen = () => {
  //     console.log("Connected to fingerprint scanner server");
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.fingerprintID) {
  //         console.log("Received fingerprint ID:", data.fingerprintID);
  //         setFingerprintID(data.fingerprintID);
  //         setFormEnabled(true);
  //         setAlert({
  //           type: "success",
  //           message: "Fingerprint scanned successfully! Please complete the registration.",
  //         });
  //         // Clear the alert after 3 seconds
  //         setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing fingerprint data:", error);
  //     }
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   // Clean up the WebSocket connection on component unmount
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
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
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container">
      <form onSubmit={handleRegisterStudent} className="Regform">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Backbtn />
        </div>

        <div className="title">REGISTER STUDENT</div>

        {alert.message && (
          <Alert severity={alert.type} style={{ marginBottom: "1rem" }}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            {alert.message}
          </Alert>
        )}

        <div
          className="form-scrollable"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "1rem",
          }}
        >
          {/* Display the fingerprint data or a waiting message */}
          {fingerprintID ? (
            <div className="fingerprint-id">Fingerprint ID: {fingerprintID}</div>
          ) : (
            <div className="fingerprint-id">Waiting for fingerprint scan...</div>
          )}

          <div className="form-inputs">
            <label htmlFor="name">Enter Name</label>
            <input
              type="text"
              name="name"
              value={studentData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              disabled={!formEnabled}
            />

            <label htmlFor="matricNumber">Enter Matric Number</label>
            <input
              type="text"
              name="matricNumber"
              value={studentData.matricNumber.toUpperCase()}
              onChange={handleInputChange}
              placeholder="Y/ND/17378"
              required
              disabled={!formEnabled}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !formEnabled} className="submit-btn">
          {loading ? "Saving..." : "Save Data"}
        </button>
      </form>
    </div>
  );
}

export default RegisterStudent;
