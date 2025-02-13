import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/config/AuthProvider"; // Ensure this path matches your project
import HomeScreen from "./components/HomeScreen/HomeScreen";
import RegisterStudent from "./components/RegisterStudent/RegisterStudent";
import RegisterCourse from "./components/RegisterCourse/RegisterCourse";
import TakeAttendance from "./components/TakeAttendance/TakeAttendance";
import ViewAttendance from "./components/ViewAttendance/ViewAttendance";
import SignupUser from "./components/SignupUser/SignupUser";
import LoginUser from "./components/LoginUser/LoginUser";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ViewCourse from "./components/ViewCourse/ViewCourse";
import Registeration from "./components/Registeration/Registeration";
import ViewStudents from "./components/ViewStudents/ViewStudents"
import { BluetoothProvider } from "./components/BluetoothButton/BluetoothContext";
import "antd/dist/reset.css";
function App() {
  return (
    <AuthProvider>
      <BluetoothProvider>
      <Router>
          <Routes>
            <Route path="/" element={<LoadingScreen />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <HomeScreen />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<SignupUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route
              path="/registerStudent"
              element={
                <PrivateRoute>
                  <RegisterStudent />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewCourses"
              element={
                <PrivateRoute>
                  <ViewCourse />
                </PrivateRoute>
              }
            />
                        <Route
              path="/viewStudent"
              element={
                <PrivateRoute>
                  <ViewStudents />
                </PrivateRoute>
              }
            />
            <Route 
            path="/registration"
            element={
              <PrivateRoute>
                <Registeration/>
              </PrivateRoute>
            }
            />
            <Route
              path="/registerCourse"
              element={
                <PrivateRoute>
                  <RegisterCourse />
                </PrivateRoute>
              }
            />
            <Route
              path="/takeAttendance"
              element={
                <PrivateRoute>
                  <TakeAttendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewAttendance"
              element={
                <PrivateRoute>
                  <ViewAttendance />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </BluetoothProvider>
        
    </AuthProvider>
  );
}

export default App;
