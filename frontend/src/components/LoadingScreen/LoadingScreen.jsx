import React, { useEffect } from "react";
import "./LoadingScreen.css";
import Ylogo from "../../assets/images/white 1.png";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase"; // Adjust path if needed

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is logged in, redirect to the dashboard
          navigate("/dashboard");
        } else {
          // User is not logged in, redirect to the login page
          navigate("/login");
        }
      });
    };

    const timer = setTimeout(() => {
      checkUser();
    }, 3000); // Wait for 3 seconds before checking user

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container">
      <img src={Ylogo} alt="Yaba College of Technology Logo" className="logo" />
      <PulseLoader color="#00923f" />
    </div>
  );
};

export default LoadingScreen;

