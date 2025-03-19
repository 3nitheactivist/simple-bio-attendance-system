import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import "../ViewCourse/ViewCourse.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Ant Design components and icons
import { Table, Dropdown, Menu, Button, Modal, Spin, message, Card, Typography, Row, Col } from "antd";
import { MoreOutlined, BookOutlined, DeleteOutlined, HistoryOutlined, UserOutlined } from "@ant-design/icons";
import Backbtn from "../../utils/Backbutton/backbutton";

const { Title, Text, Paragraph } = Typography;

function ViewCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

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

  // Fetch courses for the current user
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User is not authenticated.");
        const coursesCollection = collection(db, "courses");
        const q = query(coursesCollection, where("userId", "==", userId));
        const courseSnapshot = await getDocs(q);
        const courseList = courseSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timeCreated:
              data.timeCreated instanceof Object &&
              typeof data.timeCreated.toMillis === "function"
                ? data.timeCreated.toMillis()
                : typeof data.timeCreated === "number"
                ? data.timeCreated
                : new Date(data.timeCreated).getTime() || 0,
          };
        });
        setCourses(courseList);
      } catch (error) {
        console.error(error);
        message.error("An error occurred while fetching courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Define the menu for course actions
  const handleMenuClick = ({ key }, course) => {
    if (key === "takeAttendance") {
      navigate(`/takeAttendance?courseId=${course.id}`);
    } else if (key === "viewAttendance") {
      navigate(`/viewAttendance?courseId=${course.id}`);
    } else if (key === "delete") {
      setSelectedCourse(course);
      setDeleteModalVisible(true);
    }
  };

  const menu = (course) => (
    <Menu onClick={(info) => handleMenuClick(info, course)}>
      <Menu.Item key="takeAttendance" icon={<UserOutlined />}>Take Attendance</Menu.Item>
      <Menu.Item key="viewAttendance" icon={<HistoryOutlined />}>View Attendance</Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} style={{ color: "red" }}>
        Delete Course
      </Menu.Item>
    </Menu>
  );

  // Handle course deletion
  const handleDeleteCourse = async () => {
    try {
      if (!selectedCourse) return;
      const courseDocRef = doc(db, "courses", selectedCourse.id);
      await deleteDoc(courseDocRef);
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      message.success("Course deleted successfully.");
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course. Please try again.");
    }
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Course Title",
      dataIndex: "courseTitle",
      key: "courseTitle",
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: "Course Code",
      dataIndex: "courseCode",
      key: "courseCode",
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: "Class Level",
      dataIndex: "classLevel",
      key: "classLevel",
      render: (text) => (
        <Text type="secondary" style={{ backgroundColor: "#f0f0f0", padding: "2px 8px", borderRadius: "4px" }}>
          {text}
        </Text>
      )
    },
    {
      title: "Time Created",
      dataIndex: "timeCreated",
      key: "timeCreated",
      render: (time) => (
        <Text type="secondary">
          {time ? new Date(time).toLocaleString() : "Not available"}
        </Text>
      ),
      sorter: (a, b) => a.timeCreated - b.timeCreated,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button 
            icon={<MoreOutlined />} 
            shape="circle"
            className="action-button"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <motion.div 
      className="view-course-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="dashboard-header"
        variants={itemVariants}
      >
        <div className="header-content">
          <div className="back-button-container">
            <Backbtn />
          </div>
          <div className="date-display">
            <Text type="secondary">
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </div>
          <motion.div 
            className="welcome-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Title level={2} className="greeting">
              Hello, {auth.currentUser?.displayName || "User"}
              <motion.span
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ display: "inline-block", marginLeft: "10px" }}
              >
                👋
              </motion.span>
            </Title>
            <Paragraph className="instruction-text">
              View your registered courses below. Click on the action button to access course functions.
            </Paragraph>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="courses-content"
        variants={itemVariants}
      >
        <Card className="course-card" bordered={false}>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text className="loading-text">Loading your courses...</Text>
            </div>
          ) : courses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Table
                dataSource={courses.sort((a, b) => b.timeCreated - a.timeCreated)}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                className="courses-table"
                rowClassName="course-row"
              />
            </motion.div>
          ) : (
            <motion.div 
              className="no-courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <BookOutlined className="no-courses-icon" />
              <Title level={4}>No courses available</Title>
              <Paragraph>You haven't registered any courses yet. Add a course to get started.</Paragraph>
              <Button 
                type="primary" 
                onClick={() => navigate('/registerCourse')}
              >
                Register a New Course
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <Modal
        title="Confirm Deletion"
        visible={deleteModalVisible}
        onOk={handleDeleteCourse}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the course "{selectedCourse?.courseTitle}"?
          <br />
          <Text type="danger">This action cannot be undone.</Text>
        </p>
      </Modal>
    </motion.div>
  );
}

export default ViewCourse;
