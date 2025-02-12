import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../utils/config/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show a loader while the authentication state is being determined
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f4f4f4",
        }}
      >
        <PulseLoader color="#00923f" size={15} />
      </div>
    );
  }

  // If not logged in, redirect to the login page
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
