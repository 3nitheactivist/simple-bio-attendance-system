import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./ForgotPassword.css";
import logo from "../../assets/images/logoWhite.png";
import { FaEnvelope, FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "If this email is registered, you will receive a password reset email shortly."
      );
      setEmail("");
      setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // For security, we don't reveal if the email exists or not
        setMessage(
          "If this email is registered, you will receive a password reset email shortly."
        );
        setTimeout(() => navigate("/login"), 5000);
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="forgot-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="forgot-card"
        variants={itemVariants}
      >
        <motion.div 
          className="forgot-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={logo} alt="Yaba College of Technology Logo" className="logo" />
          </motion.div>
          <h1>Password Recovery</h1>
          <p className="forgot-subtitle">Enter your email to receive a reset link</p>
        </motion.div>

        <motion.div 
          className="forgot-form-container"
          variants={itemVariants}
        >
          {message && (
            <motion.div 
              className="alert-message success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              className="alert-message error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="forgot-form">
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="email">
                <FaEnvelope className="input-icon" /> Email Address
              </label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.button 
              type="submit" 
              className="forgot-button"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              variants={itemVariants}
            >
              {loading ? (
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Send Reset Link <FaArrowRight style={{ marginLeft: "8px" }} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          className="forgot-footer"
          variants={itemVariants}
        >
          <Link to="/login" className="back-link">
            <FaArrowLeft style={{ marginRight: "8px" }} /> Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;