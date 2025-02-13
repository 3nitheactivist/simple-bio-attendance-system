// BluetoothContext.js
import React, { createContext, useContext, useState } from "react";

const BluetoothContext = createContext();

export const useBluetooth = () => useContext(BluetoothContext);

export const BluetoothProvider = ({ children }) => {
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);

  const value = { isBluetoothConnected, setIsBluetoothConnected };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};
