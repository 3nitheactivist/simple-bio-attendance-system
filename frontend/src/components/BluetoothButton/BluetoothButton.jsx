// import React, { useState } from "react";
// import { Button } from "antd";
// import { PoweroffOutlined } from "@ant-design/icons";
// import axios from "axios";

// const BluetoothButton = () => {
//   const [isRunning, setIsRunning] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const toggleServer = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/toggle-server", {
//         action: isRunning ? "stop" : "start",
//       });
//       if (response.data.success) {
//         setIsRunning(!isRunning);
//       } else {
//         console.error("Failed to toggle server:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error communicating with server:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <Button
//         type={isRunning ? "primary" : "default"}
//         icon={<PoweroffOutlined />}
//         loading={loading}
//         onClick={toggleServer}
//         danger={isRunning}
//       >
//         {isRunning ? "Stop Bluetooth" : "Start Bluetooth"}
//       </Button>
//     </div>
//   );
// };

// export default BluetoothButton;

// // BluetoothButton.jsx
// import React, { useState } from "react";
// import { Button } from "antd";
// import { PoweroffOutlined } from "@ant-design/icons";
// import axios from "axios";
// import { useBluetooth } from "./BluetoothContext";

// const BluetoothButton = () => {
//   const { isBluetoothConnected, setIsBluetoothConnected } = useBluetooth();
//   const [loading, setLoading] = useState(false);

//   const toggleServer = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/toggle-server", {
//         action: isBluetoothConnected ? "stop" : "start",
//       });
//       if (response.data.success) {
//         setIsBluetoothConnected(!isBluetoothConnected);
//       } else {
//         console.error("Failed to toggle server:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error communicating with server:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <Button
//         type={isBluetoothConnected ? "primary" : "default"}
//         icon={<PoweroffOutlined />}
//         loading={loading}
//         onClick={toggleServer}
//         danger={isBluetoothConnected}
//       >
//         {isBluetoothConnected ? "Stop Bluetooth" : "Start Bluetooth"}
//       </Button>
//     </div>
//   );
// };

// export default BluetoothButton;
// BluetoothButton.jsx
import React, { useState } from "react";
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import axios from "axios";
import { useBluetooth } from "./BluetoothContext";

const BluetoothButton = () => {
  const { isBluetoothConnected, setIsBluetoothConnected } = useBluetooth();
  const [loading, setLoading] = useState(false);

  // Use the environment variable for the API URL.
  const apiUrl = import.meta.env.VITE_API_URL;
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

console.log("Using API URL:", apiUrl);
console.log("Using WebSocket URL:", websocketUrl);

  const toggleServer = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl, {
        action: isBluetoothConnected ? "stop" : "start",
      });
      if (response.data.success) {
        setIsBluetoothConnected(!isBluetoothConnected);
      } else {
        console.error("Failed to toggle server:", response.data.message);
      }
    } catch (error) {
      console.error("Error communicating with server:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Button
        type={isBluetoothConnected ? "primary" : "default"}
        icon={<PoweroffOutlined />}
        loading={loading}
        onClick={toggleServer}
        danger={isBluetoothConnected}
      >
        {isBluetoothConnected ? "Stop Bluetooth" : "Start Bluetooth"}
      </Button>
    </div>
  );
};

export default BluetoothButton;
