import React, { useState } from "react";
import "./SignupUser.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/images/logoWhite.png";
import { FaRegEye, FaRegEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa6";

const SignupUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with the display name
      await updateProfile(user, { displayName: name });

      // Show success message
      setSuccess("Account created successfully! Redirecting to dashboard...");

      // Wait 3 seconds before navigating
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 3000);
    } catch (err) {
      console.error("Error during registration:", err.message);

      // Handle specific Firebase Auth errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="signup-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="signup-card"
        variants={itemVariants}
      >
        <motion.div 
          className="signup-header"
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
          <h1>Create Account</h1>
          <p className="signup-subtitle">Register to use the Biometric Attendance System</p>
        </motion.div>

        <motion.div 
          className="signup-form-container"
          variants={itemVariants}
        >
          {(error || success) && (
            <motion.div 
              className={`alert-message ${error ? 'error' : 'success'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error || success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <motion.div 
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="name">
                <FaUser className="input-icon" /> Full Name
              </label>
              <div className="input-container">
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </motion.div>

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
                  placeholder="Create a strong password"
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
              className="form-group"
              variants={itemVariants}
            >
              <label htmlFor="confirmPassword">
                <FaLock className="input-icon" /> Confirm Password
              </label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </motion.div>

            <motion.button 
              type="submit" 
              className="signup-button"
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
                  Sign Up <FaArrowRight style={{ marginLeft: "8px" }} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          className="signup-footer"
          variants={itemVariants}
        >
          <p>
            Already have an account?{" "}
            <Link to="/login" className="signup-link">
              Log In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignupUser;
