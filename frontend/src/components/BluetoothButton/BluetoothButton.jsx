import React, { useState } from "react";
import '../BluetoothButton/BluetoothButton.css'

const BluetoothButton = () => {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState(null);

  const connectBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['00001101-0000-1000-8000-00805F9B34FB'] }]
      });
      const server = await device.gatt.connect();
      setDevice(device);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const disconnectBluetooth = async () => {
    if (device && device.gatt.connected) {
      await device.gatt.disconnect();
      setConnected(false);
      setDevice(null);
    }
  };

  return (
    <button
      onClick={connected ? disconnectBluetooth : connectBluetooth}
      className="floating-button"
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
  );
};

export default BluetoothButton;
