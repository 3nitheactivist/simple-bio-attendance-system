import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./ViewStudent.css";
import { motion } from "framer-motion";

// Ant Design components
import { Table, Card, Typography, Spin, Empty, Input, Button, Select, Space, Badge, Tooltip, Tag } from "antd";
import { SearchOutlined, UserOutlined, FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import Backbtn from "../../utils/Backbutton/backbutton";

const { Title, Text } = Typography;
const { Option } = Select;

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState([]);
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

  // Fetch all students from the global collection
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("User not authenticated");
        }
        
        // Query the students collection for this user's students
        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const studentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Format the date for display
          formattedDate: doc.data().dateCreated ? 
            new Date(doc.data().dateCreated).toLocaleString() : 
            "N/A"
        }));
        
        setStudents(studentsList);
        
        // Also fetch courses for potential filtering
        const coursesRef = collection(db, "courses");
        const coursesQuery = query(coursesRef, where("userId", "==", userId));
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesList);
        
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search text
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    student.matricNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    student.fingerprintID?.includes(searchText)
  );

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge color="#00923F" style={{ marginRight: 8 }} />
          <Text strong>{text || "N/A"}</Text>
        </div>
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || "")
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
      render: (text) => (
        <Text code style={{ background: "#f0f7f4", padding: "2px 8px", borderRadius: "4px" }}>
          {text || "N/A"}
        </Text>
      )
    },
    {
      title: "Fingerprint ID",
      dataIndex: "fingerprintID",
      key: "fingerprintID",
      render: (text) => (
        <Text type="secondary" style={{ fontFamily: "monospace" }}>
          {text || "N/A"}
        </Text>
      )
    },
    {
      title: "Registration Date",
      dataIndex: "formattedDate",
      key: "dateCreated",
      render: (text) => (
        <Tooltip title={text}>
          <Text type="secondary">
            <CalendarOutlined style={{ marginRight: 5 }} />
            {text}
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => {
        if (!a.dateCreated) return -1;
        if (!b.dateCreated) return 1;
        return new Date(a.dateCreated) - new Date(b.dateCreated);
      }
    }
  ];

  return (
    <motion.div 
      className="students-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="students-header"
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
              <UserOutlined style={{ marginRight: "10px" }} />
              Registered Students
            </Title>
            <Text className="header-subtitle">
              View and manage all students registered in the system
            </Text>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="students-content"
        variants={itemVariants}
      >
        <Card className="students-card">
          <div className="search-container">
            <Input
              placeholder="Search by name, matric number or fingerprint ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: "#00923F" }} />}
              allowClear
              className="search-input"
              size="large"
            />
          </div>

          {error && (
            <div className="error-message">
              <Text type="danger">{error}</Text>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text className="loading-text">Loading students...</Text>
            </div>
          ) : filteredStudents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="table-header">
                <Text type="secondary">
                  Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
                </Text>
                <Tag color="#00923F" style={{ marginLeft: 8 }}>
                  Total: {students.length}
                </Tag>
              </div>
              
              <Table
                dataSource={filteredStudents}
                columns={columns}
                rowKey="id"
                pagination={{ 
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} students`
                }}
                className="students-table"
                bordered
                rowClassName={(record, index) => 
                  index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
              />
            </motion.div>
          ) : (
            <Empty 
              description={
                searchText ? 
                  "No students match your search criteria" : 
                  "No students registered yet"
              }
              style={{ margin: "3rem 0" }}
            />
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default ViewStudents;
