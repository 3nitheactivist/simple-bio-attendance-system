// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Alert, AlertTitle } from "@mui/material";
// import { IoFingerPrintOutline } from "react-icons/io5";
// import Backbtn from "../../utils/Backbutton/backbutton";
// import { db, auth } from "../../utils/firebase/firebase";
// import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
// import "../RegisterStudent/RegisterStudent.css";
// import { useLocation } from "react-router-dom";

// import {
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormHelperText,
// } from "@mui/material";

// function RegisterStudent() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [scannerStatus, setScannerStatus] = useState("disconnected"); // 'disconnected', 'connecting', 'connected', 'scanning'
//   const [fingerprintID, setFingerprintID] = useState(null);
//   const [formEnabled, setFormEnabled] = useState(false);


// const location = useLocation();
// const queryParams = new URLSearchParams(location.search);
// const courseIdFromUrl = queryParams.get("courseId"); // Rename to avoid conflict
// const courseTitleFromUrl = queryParams.get("courseTitle");

// const [courseSelectOpen, setCourseSelectOpen] = useState(false);
// const [studentData, setStudentData] = useState({
//   name: "",
//   matricNumber: "",
// });
// const [alert, setAlert] = useState({ type: "", message: "" });
// const [authLoading, setAuthLoading] = useState(true);

// const [courses, setCourses] = useState([]);
// const [selectedCourseId, setSelectedCourseId] = useState(""); // State to store course ID

// useEffect(() => {
//   if (courseIdFromUrl) {
//     setSelectedCourseId(courseIdFromUrl); // Set state only if courseIdFromUrl exists
//   }
// }, [courseIdFromUrl]); // Depend on the URL param, not state itself

// console.log("Selected Course ID:", selectedCourseId); // Debugging log


//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const userId = auth.currentUser?.uid;
//         if (!userId) {
//           setAlert({
//             type: "error",
//             message: "You need to be logged in to view courses.",
//           });
//           return;
//         }
  
//         const coursesRef = collection(db, 'courses');
//         const coursesQuery = query(coursesRef, where('userId', '==', userId));
//         const coursesSnapshot = await getDocs(coursesQuery);
//         const coursesData = coursesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setCourses(coursesData);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setAlert({
//           type: "error",
//           message: "Failed to load courses.",
//         });
//       }
//     };
  
//     if (auth.currentUser) {
//       fetchCourses();
//     }
//   }, [auth.currentUser]);

//   // Authentication check
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         navigate("/login");
//       }
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   // Mock scanner connection
//   const connectToScanner = async () => {
//     setScannerStatus("connecting");

//     // Simulate connection delay
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     setScannerStatus("connected");
//     setAlert({
//       type: "success",
//       message: "Scanner connected successfully",
//     });

//     // Clear alert after 3 seconds
//     setTimeout(() => {
//       setAlert({ type: "", message: "" });
//     }, 3000);
//   };

//   // Mock fingerprint scanning
//   const startScanning = async () => {
//     if (scannerStatus !== "connected") {
//       setAlert({
//         type: "error",
//         message: "Please connect to the scanner first",
//       });
//       setTimeout(() => {
//         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//       }, 3000);
//       return;
//     }

//     setScannerStatus("scanning");
//     setLoading(true);

//     try {
//       // Simulate scanning delay
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       // Generate mock fingerprint ID
//       const mockFingerprintID = `FP${Math.floor(Math.random() * 10000)}`;
//       setFingerprintID(mockFingerprintID);
//       setFormEnabled(true);
//       setScannerStatus("connected");

//       setAlert({
//         type: "success",
//         message:
//           "Fingerprint scanned successfully! Please complete the registration.",
//       });
//       setTimeout(() => {
//         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//       }, 3000);
//     } catch (error) {
//       setAlert({
//         type: "error",
//         message: "Failed to scan fingerprint. Please try again.",
//       });

//       setTimeout(() => {
//         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStudentData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };



//   // const handleRegisterStudent = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setAlert({ type: "", message: "" });

//   //   try {
//   //     const userId = auth.currentUser?.uid;
//   //     if (!userId) {
//   //       setAlert({
//   //         type: "error",
//   //         message: "You need to be logged in to register a student.",
//   //       });

//   //       setTimeout(() => {
//   //         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//   //       }, 3000);
//   //       return;
//   //     }

//   //     if (!selectedCourseId) {
//   //       setAlert({
//   //         type: "error",
//   //         message: "Please select a course.",
//   //       });
//   //       return;
//   //     }

//   //     if (!fingerprintID) {
//   //       setAlert({
//   //         type: "error",
//   //         message: "Please scan fingerprint before registering.",
//   //       });

//   //       setTimeout(() => {
//   //         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//   //       }, 3000);
//   //       return;
//   //     }

//   //     // Check if fingerprint ID already exists
//   //     const enrollmentsRef = collection(
//   //       db,
//   //       "course",
//   //       selectedCourseId,
//   //       "enrollments"
//   //     );
//   //     const fingerprintQuery = query(
//   //       enrollmentsRef,
//   //       where("fingerprintID", "==", fingerprintID)
//   //     );

//   //     const existingFingerprint = await getDocs(fingerprintQuery);
//   //     if (!existingFingerprint.empty) {
//   //       setAlert({
//   //         type: "error",
//   //         message: "This fingerprint ID is already registered.",
//   //       });

//   //       setTimeout(() => {
//   //         setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//   //       }, 3000);
//   //       return;
//   //     }

//   //     // Register the student directly in the enrollments collection
//   //     await addDoc(enrollmentsRef, {
//   //       name: studentData.name,
//   //       matricNumber: studentData.matricNumber,
//   //       fingerprintID,
//   //       dateCreated: new Date().toISOString(),
//   //       userId: userId,
//   //       courseCode: selectedCourseId, // Store the course reference
//   //     });

//   //     setAlert({
//   //       type: "success",
//   //       message: "Student registered successfully!",
//   //     });

//   //     // Add a 3-second timeout to clear the alert
//   //     setTimeout(() => {
//   //       setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//   //     }, 3000);

//   //     // Reset form
//   //     setStudentData({
//   //       name: "",
//   //       matricNumber: "",
//   //     });
//   //     setFingerprintID(null);
//   //     setFormEnabled(false);
//   //     setSelectedCourseId("");
//   //   } catch (error) {
//   //     console.error("Error registering student:", error);
//   //     setAlert({
//   //       type: "error",
//   //       message:
//   //         "An error occurred while registering the student. Please try again.",
//   //     });

//   //     setTimeout(() => {
//   //       setAlert({ type: "", message: "" }); // Clear the alert after 3 seconds
//   //     }, 3000);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleRegisterStudent = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAlert({ type: "", message: "" });
  
//     try {
//       const userId = auth.currentUser?.uid;
//       if (!userId) {
//         setAlert({ type: "error", message: "You need to be logged in to register a student." });
//         setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//         return;
//       }
  
//       if (!selectedCourseId) {
//         setAlert({ type: "error", message: "Please select a course." });
//         return;
//       }
  
//       if (!fingerprintID) {
//         setAlert({ type: "error", message: "Please scan fingerprint before registering." });
//         setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//         return;
//       }
  
//       // References to collections
//       const studentsRef = collection(db, "students");
//       const enrollmentsRef = collection(db, "courses", selectedCourseId, "enrollments");
  
//       // Check if fingerprint ID already exists in the students collection
//       const studentQuery = query(studentsRef, where("fingerprintID", "==", fingerprintID));
//       const studentSnapshot = await getDocs(studentQuery);
  
//       let studentId = null;
  
//       if (!studentSnapshot.empty) {
//         studentId = studentSnapshot.docs[0].id; // Existing student ID
//       } else {
//         // Register student in the students collection first
//         const studentDocRef = await addDoc(studentsRef, {
//           name: studentData.name,
//           matricNumber: studentData.matricNumber,
//           fingerprintID,
//           dateCreated: new Date().toISOString(),
//           userId,
//         });
  
//         studentId = studentDocRef.id; // Get the new document ID
//       }
  
//       // Check if student is already enrolled in this course
//       const enrollmentQuery = query(enrollmentsRef, where("fingerprintID", "==", fingerprintID));
//       const existingEnrollment = await getDocs(enrollmentQuery);
//       if (!existingEnrollment.empty) {
//         setAlert({ type: "error", message: "This student is already enrolled in this course." });
//         setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//         return;
//       }
  
//       // Register the student under the course enrollments
//       await addDoc(enrollmentsRef, {
//         studentId, // Reference to the global student record
//         name: studentData.name,
//         matricNumber: studentData.matricNumber,
//         fingerprintID,
//         dateCreated: new Date().toISOString(),
//         userId,
//         courseCode: selectedCourseId,
//       });
  
//       setAlert({ type: "success", message: "Student registered successfully!" });
  
//       setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  
//       // Reset form
//       setStudentData({ name: "", matricNumber: "" });
//       setFingerprintID(null);
//       setFormEnabled(false);
//       setSelectedCourseId("");
//     } catch (error) {
//       console.error("Error registering student:", error);
//       setAlert({ type: "error", message: "An error occurred while registering the student. Please try again." });
//       setTimeout(() => setAlert({ type: "", message: "" }), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   if (authLoading) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div className="container">
//       <form onSubmit={handleRegisterStudent} className="Regform">
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <Backbtn />
//         </div>

//         <div className="title">REGISTER STUDENT</div>

//         {alert.message && (
//           <Alert severity={alert.type} style={{ marginBottom: "1rem" }}>
//             <AlertTitle>
//               {alert.type === "success" ? "Success" : "Error"}
//             </AlertTitle>
//             {alert.message}
//           </Alert>
//         )}

//         {/* Scrollable Form Content */}
//         <div
//           className="form-scrollable"
//           style={{
//             maxHeight: "400px", // Adjust height as needed
//             overflowY: "auto",
//             paddingRight: "1rem",
//           }}
//         >
//           <button
//             type="button"
//             onClick={connectToScanner}
//             disabled={scannerStatus !== "disconnected"}
//             className="connect-btn"
//           >
//             {scannerStatus === "connecting"
//               ? "Connecting.."
//               : "Connect Scanner"}
//           </button>

//           <div className="scan-section">
//             <IoFingerPrintOutline
//               style={{
//                 fontSize: "50px",
//                 margin: "auto",
//                 marginTop: "40px",
//                 marginBottom: "40px",
//                 color: scannerStatus === "scanning" ? "#4CAF50" : "#fff",
//               }}
//             />
//             <button
//               type="button"
//               onClick={startScanning}
//               disabled={scannerStatus !== "connected" || loading}
//               className="scan-btn"
//             >
//               {scannerStatus === "scanning"
//                 ? "Scanning..."
//                 : "Scan Fingerprint"}
//             </button>
//           </div>

//           {fingerprintID && (
//             <div className="fingerprint-id">
//               Fingerprint ID: {fingerprintID}
//             </div>
//           )}

//           <div className="form-inputs">
//             <FormControl
//               fullWidth
//               disabled={!formEnabled}
//               required
//               sx={{
//                 marginBottom: 2,
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "white",
//                   borderRadius: 1,
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "rgba(0, 0, 0, 0.6)",
//                 },
//                 "& .MuiSelect-icon": {
//                   color: "rgba(0, 0, 0, 0.54)",
//                 },
//                 "& .Mui-disabled": {
//                   backgroundColor: "#eee",
//                 },
//               }}
//             >
//               <InputLabel id="course-select-label">Select Course</InputLabel>
//               <Select
//                 labelId="course-select-label"
//                 id="course-select"
//                 value={selectedCourseId}
//                 label="Select Course"
//                 onChange={(e) => setSelectedCourseId(e.target.value)}
//                 open={courseSelectOpen}
//                 onOpen={() => setCourseSelectOpen(true)}
//                 onClose={() => setCourseSelectOpen(false)}
//               >
//                 <MenuItem value="">
//                   <em>Select a course</em>
//                 </MenuItem>
//                 {courses.map((course) => (
//                   <MenuItem key={course.id} value={course.id}>
//                     {course.courseCode} - {course.courseTitle}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {courses.length === 0 && (
//                 <FormHelperText>No courses available</FormHelperText>
//               )}
//             </FormControl>

//             <label htmlFor="name">Enter Name</label>
//             <input
//               type="text"
//               name="name"
//               value={studentData.name}
//               onChange={handleInputChange}
//               placeholder="Full Name"
//               required
//               disabled={!formEnabled}
//             />

//             <label htmlFor="matricNumber">Enter Matric Number</label>
//             <input
//               type="text"
//               name="matricNumber"
//               value={studentData.matricNumber.toUpperCase()}
//               onChange={handleInputChange}
//               placeholder="Y/ND/17378"
//               required
//               disabled={!formEnabled}
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading || !formEnabled}
//           className="submit-btn"
//         >
//           {loading ? "Saving..." : "Save Data"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default RegisterStudent;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";
import { IoFingerPrintOutline } from "react-icons/io5";
import Backbtn from "../../utils/Backbutton/backbutton";
import { db, auth } from "../../utils/firebase/firebase";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import "../RegisterStudent/RegisterStudent.css";

function RegisterStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("disconnected"); // 'disconnected', 'connecting', 'connected', 'scanning'
  const [fingerprintID, setFingerprintID] = useState(null);
  const [formEnabled, setFormEnabled] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    matricNumber: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [authLoading, setAuthLoading] = useState(true);

  // Remove course selection state and fetching logic

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

  // Mock scanner connection
  const connectToScanner = async () => {
    setScannerStatus("connecting");

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setScannerStatus("connected");
    setAlert({
      type: "success",
      message: "Scanner connected successfully",
    });

    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 3000);
  };

  // Mock fingerprint scanning
  const startScanning = async () => {
    if (scannerStatus !== "connected") {
      setAlert({
        type: "error",
        message: "Please connect to the scanner first",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
      return;
    }

    setScannerStatus("scanning");
    setLoading(true);

    try {
      // Simulate scanning delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate mock fingerprint ID
      const mockFingerprintID = `FP${Math.floor(Math.random() * 10000)}`;
      setFingerprintID(mockFingerprintID);
      setFormEnabled(true);
      setScannerStatus("connected");

      setAlert({
        type: "success",
        message:
          "Fingerprint scanned successfully! Please complete the registration.",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to scan fingerprint. Please try again.",
      });
      setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updated handleRegisterStudent to register the student globally
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

      // Register the student in the global students collection
      await addDoc(studentsRef, {
        name: studentData.name,
        matricNumber: studentData.matricNumber,
        fingerprintID,
        dateCreated: new Date().toISOString(),
        userId,
      });

      setAlert({ type: "success", message: "Student registered successfully!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 3000);

      // Reset form
      setStudentData({ name: "", matricNumber: "" });
      setFingerprintID(null);
      setFormEnabled(false);
    } catch (error) {
      console.error("Error registering student:", error);
      setAlert({ type: "error", message: "An error occurred while registering the student. Please try again." });
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

        {/* Scrollable Form Content */}
        <div
          className="form-scrollable"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "1rem",
          }}
        >
          <button
            type="button"
            onClick={connectToScanner}
            disabled={scannerStatus !== "disconnected"}
            className="connect-btn"
          >
            {scannerStatus === "connecting" ? "Connecting.." : "Connect Scanner"}
          </button>

          <div className="scan-section">
            <IoFingerPrintOutline
              style={{
                fontSize: "50px",
                margin: "auto",
                marginTop: "40px",
                marginBottom: "40px",
                color: scannerStatus === "scanning" ? "#4CAF50" : "#fff",
              }}
            />
            <button
              type="button"
              onClick={startScanning}
              disabled={scannerStatus !== "connected" || loading}
              className="scan-btn"
            >
              {scannerStatus === "scanning" ? "Scanning..." : "Scan Fingerprint"}
            </button>
          </div>

          {fingerprintID && (
            <div className="fingerprint-id">
              Fingerprint ID: {fingerprintID}
            </div>
          )}

          <div className="form-inputs">
            {/* Removed course selection */}
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
