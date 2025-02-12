// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
// import { db, auth } from '../../utils/firebase/firebase';
// import image from "../../assets/images/white 1.png";
// import '../ViewAttendance/ViewAttendance.css'
// import Backbtn from "../../utils/Backbutton/backbutton";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Alert,
//   Button
// } from '@mui/material';

// function ViewAttendance() {
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendanceData, setAttendanceData] = useState(null);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const userId = auth.currentUser?.uid;
//         const coursesRef = collection(db, "course");
//         const q = query(coursesRef, where("userId", "==", userId));
//         const querySnapshot = await getDocs(q);
        
//         const coursesList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
        
//         setCourses(coursesList);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setError("Failed to fetch courses");
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     if (!selectedCourse || !selectedDate) {
//       setError("Please select both course and date");
//       return;
//     }

//     try {
//       const attendanceRef = doc(db, "course", selectedCourse, "attendance", selectedDate);
//       const attendanceSnap = await getDoc(attendanceRef);

//       if (!attendanceSnap.exists()) {
//         setError("No attendance record found for this date");
//         setAttendanceData(null);
//         return;
//       }

//       const data = attendanceSnap.data();
//       setAttendanceData(data);
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error fetching attendance:", error);
//       setError("Failed to fetch attendance data");
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleBack = () => {
//     setShowForm(true);
//     setAttendanceData(null);
//     setError(null);
//   };

//   return (
//     <div className="container">
//       <div className="no-print">
//         <img
//           src={image}
//           alt="Yaba College of Technology Logo"
//           className="logo-1"
//         />
//       </div>

//       {showForm ? (
//         <form onSubmit={handleSubmit} className="Regform no-print">
//           <Backbtn />
//           <div className="title">VIEW ATTENDANCE</div>

//           <FormControl fullWidth margin="normal">
//             <InputLabel  style={{color: "black"}}>Select Course</InputLabel>
//             <Select
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//               required
//               style={{backgroundColor: "white", color: "black"}}
//             >
//               {courses.map((course) => (
//                 <MenuItem key={course.id} value={course.id}>
//                   {course.courseCode} - {course.courseTitle}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               required
//               style={{ padding: '10px', marginTop: '10px' }}
//             />
//           </FormControl>

//           {error && <Alert severity="error" style={{ marginTop: '10px' }}>{error}</Alert>}

//           <Button 
//             type="submit" 
//             variant="contained" 
//             color="primary" 
//             fullWidth 
//             style={{ marginTop: '20px' }}
//           >
//             View
//           </Button>
//         </form>
//       ) : (
//         <div className="attendance-view">
//           <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//             <Button onClick={handleBack} variant="outlined">
//               Back to Form
//             </Button>
//             <Button onClick={handlePrint} variant="contained" color="primary">
//               Print Attendance
//             </Button>
//           </div>

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Matric Number</TableCell>
//                   <TableCell>Time Marked</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {attendanceData?.students.map((student, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.matricNumber}</TableCell>
//                     <TableCell>{new Date(student.timeMarked).toLocaleString()}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ViewAttendance;

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import Backbtn from "../../utils/Backbutton/backbutton";
import image from "../../assets/images/white 1.png";
import "../ViewAttendance/ViewAttendance.css";

// Ant Design components
import { Table, Form, Select, DatePicker, Button, Alert, Spin } from "antd";
import moment from "moment";

const { Option } = Select;

function ViewAttendance() {
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Fetch courses for the current user
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = auth.currentUser?.uid;
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const coursesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    setError(null);
    const { courseId, date } = values;
    if (!courseId || !date) {
      setError("Please select both course and date");
      return;
    }
    setLoading(true);
    try {
      // Define the start and end of the selected day using moment
      const startOfDay = moment(date).startOf("day").toISOString();
      const endOfDay = moment(date).endOf("day").toISOString();

      // Query the global attendance collection
      const attendanceRef = collection(db, "attendance");
      const q = query(
        attendanceRef,
        where("courseID", "==", courseId),
        where("timeMarked", ">=", startOfDay),
        where("timeMarked", "<=", endOfDay)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("No attendance record found for this date");
        setAttendanceData([]);
      } else {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAttendanceData(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowForm(true);
    setAttendanceData([]);
    setError(null);
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
    },
    {
      title: "Time Marked",
      dataIndex: "timeMarked",
      key: "timeMarked",
      render: (text) => moment(text).format("LLL"),
    },
  ];

  return (
    <div className="container">
      <div className="no-print">
        <img src={image} alt="Logo" className="logo-1" />
      </div>

      {showForm ? (
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          className="attendance-form no-print"
          style={{ maxWidth: 500, margin: "0 auto", padding: "20px" }}
        >
          <Backbtn />
          <h1 className="title">VIEW ATTENDANCE</h1>
          <Form.Item
            label="Select Course"
            name="courseId"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select placeholder="Select Course">
              {courses.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseTitle}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Select Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "View"}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="attendance-view">
          <div
            className="no-print"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Button onClick={handleBack}>Back to Form</Button>
            <Button type="primary" onClick={() => window.print()}>
              Print Attendance
            </Button>
          </div>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Table
            dataSource={attendanceData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;
