import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import { motion } from "framer-motion";
import "./LoginUser.css";
import logo from "../../assets/images/logoWhite.png";
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa6";

function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Authenticate user with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please check your credentials.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="login-card"
        variants={itemVariants}
      >
        <motion.div 
          className="login-header"
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
          <h1>Log In</h1>
          <p className="login-subtitle">Access the Biometric Attendance System</p>
        </motion.div>

        <motion.div 
          className="login-form-container"
          variants={itemVariants}
        >
          {error && (
            <motion.div 
              className="alert-message error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="login-form">
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="password">
                <FaLock className="input-icon" /> Password
              </label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </motion.div>

            <motion.div 
              className="forgot-password"
              variants={itemVariants}
            >
              <Link to="/forgotPassword" className="forgot-link">
                Forgot your password?
              </Link>
            </motion.div>

            <motion.button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              variants={itemVariants}
            >
              {isLoading ? (
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  Log In <FaArrowRight style={{ marginLeft: "8px" }} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          className="login-footer"
          variants={itemVariants}
        >
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="login-link">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LoginUser;
