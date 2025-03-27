import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import RegisterStudent from "./components/RegisterStudent/RegisterStudent";
import TakeAttendance from "./components/TakeAttendance/TakeAttendance";
import ViewStudents from "./components/ViewStudents/ViewStudents"
import { BluetoothProvider } from "./components/BluetoothButton/BluetoothContext";
import "antd/dist/reset.css";
function App() {
  return (
      <BluetoothProvider>
      <Router>
          <Routes>
            <Route
              path="/"
              element={
                  <HomeScreen />  
              }
            />
            <Route
              path="/registerStudent"
              element={
                  <RegisterStudent />
              }
            />
            <Route
              path="/viewStudent"
              element={
                  <ViewStudents />
              }
            />
            <Route
              path="/takeAttendance"
              element={
                  <TakeAttendance />
              }
            />
          </Routes>
        </Router>
      </BluetoothProvider>
  );
}

export default App;
