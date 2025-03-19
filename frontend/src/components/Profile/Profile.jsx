import React, { useState, useEffect } from "react";
import "./Profile.css";
import { RiMenu3Line } from "react-icons/ri";
import Sidebar from "../Sidebar/Sidebar";
import useAuth from "../../utils/config/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { motion } from "framer-motion";

// Ant Design components
import { Typography, Spin, Avatar, Button, Input, notification } from "antd";
import { 
  UserOutlined, 
  BookOutlined, 
  SaveOutlined, 
  CheckCircleOutlined,
  BuildOutlined,
  SettingOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

function Profile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form State
  const [level, setLevel] = useState("");
  const [courseOfStudy, setCourseOfStudy] = useState("");

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

  // Fetch Profile Data on Load
  useEffect(() => { 
    const fetchProfile = async () => {
      setLoading(true);
      if (currentUser) {
        try {
          const userDoc = doc(db, "profile-update", currentUser.uid);
          const snapshot = await getDoc(userDoc);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setLevel(data.level || ""); // Set fetched level
            setCourseOfStudy(data.courseOfStudy || ""); // Set fetched course of study
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          notification.error({
            message: "Failed to load profile",
            description: "There was an error loading your profile information."
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
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
      setUpdating(true);
      if (!currentUser?.uid) {
        notification.error({
          message: "Authentication Error",
          description: "User not authenticated. Please log in."
        });
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

      notification.success({
        message: "Profile Updated",
        description: "Your profile has been updated successfully!",
        icon: <CheckCircleOutlined style={{ color: "#00923F" }} />
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update profile. Please try again."
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div 
      className="profile-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header 
        className="profile-header"
        variants={itemVariants}
      >
        <div className="header-content">
          <div className="menu-icon-container">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RiMenu3Line onClick={toggleSidebar} className="menu-icon" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Title level={2} className="page-title">
              <UserOutlined style={{ marginRight: "10px" }} />
              My Profile
            </Title>
            <Text className="header-subtitle">
              View and update your profile information
            </Text>
          </motion.div>
        </div>
      </motion.header>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <motion.div className="profile-content" variants={itemVariants}>
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text className="loading-text">Loading profile...</Text>
            </div>
          ) : (
            <>
              <motion.div 
                className="profile-avatar-section"
                variants={itemVariants}
              >
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <Title level={3} className="profile-name">
                    {currentUser?.displayName || "User"}
                  </Title>
                  <Text className="profile-email">
                    {currentUser?.email || "No email available"}
                  </Text>
                </div>
              </motion.div>

              <div className="profile-divider" />

              <motion.div 
                className="profile-form"
                variants={itemVariants}
              >
                <div className="form-section-title">
                  <SettingOutlined className="section-icon" />
                  <Text strong>Account Information</Text>
                </div>

                <div className="form-group">
                  <label htmlFor="level">
                    <BuildOutlined className="input-icon" /> Academic Level
                  </label>
                  <Input
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value.toUpperCase())}
                    placeholder="Enter your level (e.g. 300L)"
                    size="large"
                    prefix={<BuildOutlined style={{ color: "#00923F" }} />}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="courseOfStudy">
                    <BookOutlined className="input-icon" /> Course of Study
                  </label>
                  <Input
                    id="courseOfStudy"
                    value={courseOfStudy}
                    onChange={(e) => setCourseOfStudy(e.target.value.toUpperCase())}
                    placeholder="Enter your course of study"
                    size="large"
                    prefix={<BookOutlined style={{ color: "#00923F" }} />}
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="button-container"
                >
                  <Button 
                    onClick={handleUpdate} 
                    loading={updating}
                    className="update-button"
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
