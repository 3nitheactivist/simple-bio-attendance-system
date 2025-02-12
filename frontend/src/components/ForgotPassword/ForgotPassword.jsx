// import React, { useState } from "react";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../utils/firebase/firebase"; // Adjust path as needed
// import { useNavigate } from "react-router-dom";
// import image from "../../assets/images/white 1.png"; // Adjust to your logo path
// import "./ForgotPassword.css";
// import { Alert, AlertTitle } from "@mui/material";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage(
//         "Password reset email sent! Check your inbox for the reset link."
//       );
//       setEmail("");
//       setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
//     } catch (err) {
//       setError("Failed to send reset email. Please try again.");
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <img
//         src={image}
//         alt="Yaba College of Technology Logo"
//         className="logo-1"
//       />

//       <form className="Regform" onSubmit={handleSubmit}>
//         <div className="title">FORGOT PASSWORD</div>

//         {/* Display Success or Error Message */}
//         {message && (
//           <Alert severity="success" className="alert">
//             <AlertTitle>Success</AlertTitle>
//             {message}
//           </Alert>
//         )}
//         {error && (
//           <Alert severity="error" className="alert">
//             <AlertTitle>Error</AlertTitle>
//             {error}
//           </Alert>
//         )}

//         <label htmlFor="email">Enter Email Address</label>
//         <input
//           type="email"
//           placeholder="sample@gmail.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Reset"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;


// import React, { useState } from "react";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../utils/firebase/firebase"; // Adjust path as needed
// import { useNavigate } from "react-router-dom";
// import image from "../../assets/images/white 1.png"; // Adjust to your logo path
// import "./ForgotPassword.css";
// import { Alert, AlertTitle } from "@mui/material";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage(
//         "Password reset email sent! Check your inbox for the reset link."
//       );
//       setEmail("");
//       setTimeout(() => navigate("/login"), 5000); // Redirect to login after 5 seconds
//     } catch (err) {
//       // Check for specific error codes
//       if (err.code === "auth/user-not-found") {
//         setError("This email isn't registered. Please check and try again.");
//       } else {
//         setError("Failed to send reset email. Please try again.");
//       }
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <img
//         src={image}
//         alt="Yaba College of Technology Logo"
//         className="logo-1"
//       />

//       <form className="Regform" onSubmit={handleSubmit}>
//         <div className="title">FORGOT PASSWORD</div>

//         {/* Display Success or Error Message */}
//         {message && (
//           <Alert severity="success" className="alert">
//             <AlertTitle>Success</AlertTitle>
//             {message}
//           </Alert>
//         )}
//         {error && (
//           <Alert severity="error" className="alert">
//             <AlertTitle>Error</AlertTitle>
//             {error}
//           </Alert>
//         )}

//         <label htmlFor="email">Enter Email Address</label>
//         <input
//           type="email"
//           placeholder="sample@gmail.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Reset"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/white 1.png"; // Adjust to your logo path
import "./ForgotPassword.css";
import { Alert, AlertTitle } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError("Failed to send reset email. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img
        src={image}
        alt="Yaba College of Technology Logo"
        className="logo-1"
      />

      <form className="Regform" onSubmit={handleSubmit}>
        <div className="title">FORGOT PASSWORD</div>

        {/* Display Success or Error Message */}
        {message && (
          <Alert severity="success" className="alert">
            <AlertTitle>Success</AlertTitle>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" className="alert">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <label htmlFor="email">Enter Email Address</label>
        <input
          type="email"
          placeholder="sample@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Reset"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;