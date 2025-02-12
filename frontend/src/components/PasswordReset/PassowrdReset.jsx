// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../utils/firebase/firebase"; // Adjust the path to Firebase
// import { updatePassword } from "firebase/auth";
// import image from "../../assets/images/white 1.png"; // Adjust the path to your logo

// const PassowrdReset = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");

//     if (newPassword !== confirmNewPassword) {
//       setError("Passwords do not match!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const user = auth.currentUser; // Get the currently signed-in user
//       if (!user) {
//         setError("No authenticated user. Please log in again.");
//         setLoading(false);
//         navigate("/login");
//         return;
//       }

//       await updatePassword(user, newPassword); // Update the user's password
//       setMessage("Password updated successfully!");
//       setNewPassword("");
//       setConfirmNewPassword("");
//       setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
//     } catch (err) {
//       setError("Failed to update password. Please try again.");
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
//         <label htmlFor="Newpassword">Enter New Password</label>
//         <input
//           type="password"
//           placeholder="**************"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <label htmlFor="confirmNewPassword">Confirm New Password</label>
//         <input
//           type="password"
//           placeholder="**************"
//           value={confirmNewPassword}
//           onChange={(e) => setConfirmNewPassword(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Updating..." : "Enter"}
//         </button>
//       </form>

//       {/* Display Success or Error Message */}
//       {message && <p className="success-message">{message}</p>}
//       {error && <p className="error-message">{error}</p>}
//     </div>
//   );
// };

// export default PassowrdReset;

