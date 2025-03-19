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
import "../ViewAttendance/ViewAttendance.css";
import { motion } from "framer-motion";

// Ant Design components
import { Table, Form, Select, DatePicker, Button, Alert, Spin, Card, Typography, Empty, Badge, Tooltip } from "antd";
import { CalendarOutlined, FileSearchOutlined, PrinterOutlined, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { Title, Text } = Typography;

function ViewAttendance() {
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const formItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  // Fetch courses for the current user
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true);
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
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (values) => {
    setError(null);
    const { courseId, date } = values;
  
    if (!courseId || !date) {
      setError("Please select both course and date");
      return;
    }
    setLoading(true);
    setSelectedDate(date.format("YYYY-MM-DD"));
  
    try {
      // Find the selected course details
      const courseDetails = courses.find(course => course.id === courseId);
      setSelectedCourseDetails(courseDetails);
      
      // Use Moment for date handling
      const startOfDay = Timestamp.fromDate(date.clone().startOf("day").toDate());
      const nextDay = Timestamp.fromDate(date.clone().add(1, "day").startOf("day").toDate());
  
      // Build the query using the correct time range
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
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge color="#00923F" style={{ marginRight: 8 }} />
          <Text strong>{text}</Text>
        </div>
      )
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
      render: (text) => <Text code style={{ background: "#f0f7f4", padding: "2px 8px", borderRadius: "4px" }}>{text}</Text>
    },
    {
      title: "Time Marked",
      dataIndex: "timeMarked",
      key: "timeMarked",
      render: (value) => (
        <Tooltip title={moment(value?.toDate ? value.toDate() : value).format("MMMM D, YYYY h:mm:ss A")}>
          <Text type="secondary">
            {moment(value?.toDate ? value.toDate() : value).format("LLL")}
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => {
        const aTime = a.timeMarked?.toDate ? a.timeMarked.toDate() : new Date(a.timeMarked);
        const bTime = b.timeMarked?.toDate ? b.timeMarked.toDate() : new Date(b.timeMarked);
        return aTime - bTime;
      }
    },
  ];

  return (
    <motion.div 
      className="attendance-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="attendance-header"
        variants={itemVariants}
      >
        <div className="header-content">
          <div className="back-button-container">
            <Backbtn />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Title level={2} className="page-title">
              <CalendarOutlined style={{ marginRight: "10px" }} />
              Attendance Records
            </Title>
            <Text className="header-subtitle">
              View and track student attendance by course and date
            </Text>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="attendance-content"
        variants={itemVariants}
      >
        {showForm ? (
          <Card className="form-card">
            <Form
              onFinish={handleSubmit}
              layout="vertical"
              className="attendance-form"
            >
              <motion.div 
                variants={formItemVariants}
                initial="hidden" 
                animate="visible"
              >
                <Title level={4} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                  <FileSearchOutlined style={{ marginRight: "8px" }} />
                  View Attendance
                </Title>
              </motion.div>
              
              <motion.div variants={formItemVariants}>
                <Form.Item
                  label="Select Course"
                  name="courseId"
                  rules={[{ required: true, message: "Please select a course" }]}
                >
                  <Select 
                    placeholder="Select Course" 
                    size="large"
                    loading={fetchingCourses}
                    disabled={fetchingCourses}
                    showSearch
                    optionFilterProp="children"
                  >
                    {courses.map((course) => (
                      <Option key={course.id} value={course.id}>
                        {course.courseCode} - {course.courseTitle}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </motion.div>
              
              <motion.div variants={formItemVariants}>
                <Form.Item
                  label="Select Date"
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker 
                    style={{ width: "100%" }} 
                    size="large"
                    format="YYYY-MM-DD"
                    suffixIcon={<CalendarOutlined style={{ color: "#00923F" }} />}
                    allowClear
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  />
                </Form.Item>
              </motion.div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                </motion.div>
              )}
              
              <motion.div variants={formItemVariants}>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    disabled={loading}
                    size="large"
                    className="submit-button"
                    icon={loading ? <Spin size="small" /> : <FileSearchOutlined />}
                  >
                    {loading ? "Loading..." : "View Records"}
                  </Button>
                </Form.Item>
              </motion.div>
            </Form>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="results-card">
              <div className="results-header">
                <div className="results-title">
                  {selectedCourseDetails && (
                    <div>
                      <Title level={4}>
                        {selectedCourseDetails.courseTitle}
                        <Badge 
                          count={attendanceData.length} 
                          style={{ backgroundColor: '#00923F', marginLeft: 10 }} 
                          overflowCount={999}
                        />
                      </Title>
                      <Text type="secondary">
                        {selectedCourseDetails.courseCode} • {selectedCourseDetails.classLevel} •{' '}
                        <span style={{ fontWeight: 500 }}>{selectedDate}</span>
                      </Text>
                    </div>
                  )}
                </div>
                
                <div className="results-actions">
                  <Button 
                    onClick={handleBack} 
                    icon={<ArrowLeftOutlined />}
                    style={{ marginRight: 10 }}
                  >
                    Back
                  </Button>
                  <Tooltip title="Print attendance record">
                    <Button 
                      type="primary" 
                      onClick={() => window.print()}
                      className="print-button"
                      icon={<PrinterOutlined />}
                    >
                      Print Records
                    </Button>
                  </Tooltip>
                </div>
              </div>
              
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              
              {attendanceData.length > 0 ? (
                <Table
                  dataSource={attendanceData}
                  columns={columns}
                  rowKey="id"
                  pagination={{ 
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} records`
                  }}
                  className="attendance-table"
                  bordered
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={3}>
                          <Text strong>Total Students: {attendanceData.length}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              ) : (
                <Empty 
                  description={
                    <Text style={{ color: "#666" }}>
                      No attendance records found for this date
                    </Text>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ margin: "3rem 0" }}
                />
              )}
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ViewAttendance;
