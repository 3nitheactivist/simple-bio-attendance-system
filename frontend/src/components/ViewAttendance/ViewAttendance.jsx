

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
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

  // 1️⃣ This is the real handleSubmit that uses the form values
  // const handleSubmit = async (values) => {
  //   setError(null);
  //   const { courseId, date } = values;

  //   // Validate
  //   if (!courseId || !date) {
  //     setError("Please select both course and date");
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     // 2️⃣ Convert the selected date to Firestore Timestamps
  //     const startOfDay = Timestamp.fromDate(moment(date).startOf("day").toDate());
  //     const endOfDay = Timestamp.fromDate(moment(date).endOf("day").toDate());

  //     console.log("Fetching attendance...");

  //     // 3️⃣ Build the Firestore query using courseId, startOfDay, endOfDay
  //     const attendanceQuery = query(
  //       collection(db, "attendance"),
  //       where("courseID", "==", courseId),
  //       where("timeMarked", ">=", startOfDay),
  //       where("timeMarked", "<=", endOfDay)
  //     );

  //     const querySnapshot = await getDocs(attendanceQuery);

  //     // 4️⃣ Map the results into an array
  //     const fetchedData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     console.log("Fetched attendance data:", fetchedData);

  //     if (fetchedData.length === 0) {
  //       setError("No attendance record found for this date");
  //       setAttendanceData([]);
  //     } else {
  //       setAttendanceData(fetchedData);
  //     }

  //     setShowForm(false);
  //   } catch (err) {
  //     console.error("Error fetching attendance:", err);
  //     setError("Failed to fetch attendance data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (values) => {
  //   setError(null);
  //   const { courseId, date } = values;
  
  //   if (!courseId || !date) {
  //     setError("Please select both course and date");
  //     return;
  //   }
  //   setLoading(true);
  
  //   try {
  //     console.log("Selected date:", date.format());
  
  //     // Define startOfDay as the beginning of the selected date,
  //     // and nextDay as the beginning of the following day.
  //     const startOfDay = Timestamp.fromDate(moment(date).startOf("day").toDate());
  //     const nextDay = Timestamp.fromDate(moment(date).add(1, "day").startOf("day").toDate());
  
  //     console.log("Start of day:", startOfDay.toDate());
  //     console.log("Next day (exclusive):", nextDay.toDate());
  
  //     // Build the Firestore query using courseId and the time range
  //     const attendanceQuery = query(
  //       collection(db, "attendance"),
  //       where("courseID", "==", courseId),
  //       where("timeMarked", ">=", startOfDay),
  //       where("timeMarked", "<", nextDay)
  //     );
  
  //     const querySnapshot = await getDocs(attendanceQuery);
  
  //     // Map the results into an array
  //     const fetchedData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  
  //     console.log("Fetched attendance data:", fetchedData);
  
  //     if (fetchedData.length === 0) {
  //       setError("No attendance record found for this date");
  //       setAttendanceData([]);
  //     } else {
  //       setAttendanceData(fetchedData);
  //     }
  
  //     setShowForm(false);
  //   } catch (err) {
  //     console.error("Error fetching attendance:", err);
  //     setError("Failed to fetch attendance data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleSubmit = async (values) => {
    setError(null);
    const { courseId, date } = values;
  
    if (!courseId || !date) {
      setError("Please select both course and date");
      return;
    }
    setLoading(true);
  
    try {
      // Log the selected date (as a moment object)
      console.log("Selected date:", date.format());
  
      // Use the Moment object directly:
      // Define startOfDay as the beginning of the selected date (inclusive)
      // Define nextDay as the beginning of the day after the selected date (exclusive)
      const startOfDay = Timestamp.fromDate(date.clone().startOf("day").toDate());
      const nextDay = Timestamp.fromDate(date.clone().add(1, "day").startOf("day").toDate());
  
      console.log("Start of day:", startOfDay.toDate());
      console.log("Next day (exclusive):", nextDay.toDate());
  
      // Build the query using the correct time range:
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("courseID", "==", courseId),
        where("timeMarked", ">=", startOfDay),
        where("timeMarked", "<", nextDay)
      );
  
      const querySnapshot = await getDocs(attendanceQuery);
  
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Fetched attendance data:", fetchedData);
  
      if (fetchedData.length === 0) {
        setError("No attendance record found for this date");
        setAttendanceData([]);
      } else {
        setAttendanceData(fetchedData);
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
      // If timeMarked is a Firestore Timestamp, we convert with .toDate()
      render: (value) =>
        moment(value?.toDate ? value.toDate() : value).format("LLL"),
    },
  ];

  return (
    <div className="container">
      <div className="no-print">
        <img src={image} alt="Logo" className="logo-1" />
      </div>

      {showForm ? (
        // 5️⃣ This form calls handleSubmit with the correct values
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
