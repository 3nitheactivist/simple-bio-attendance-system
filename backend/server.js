const WebSocket = require("ws");
const BluetoothSerialPort = require("bluetooth-serial-port").BluetoothSerialPort;
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000; // Port for the Express server
let btSerial = null;
let isBluetoothConnected = false;

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket Server
const wsServer = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server running on ws://localhost:8080");

wsServer.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("close", () => console.log("Client disconnected"));
});

// Function to start Bluetooth connection
const startBluetooth = () => {
    return new Promise((resolve, reject) => {
        btSerial = new BluetoothSerialPort();
        btSerial.inquire();

        btSerial.on("found", (address, name) => {
            console.log(`Found Bluetooth device: ${name} (${address})`);
            if (name === "HC-05") {
                btSerial.findSerialPortChannel(address, (channel) => {
                    btSerial.connect(address, channel, () => {
                        console.log("Connected to HC-05!");
                        isBluetoothConnected = true;

                        // Read data from HC-05
                        btSerial.on("data", (buffer) => {
                            const rawData = buffer.toString("utf-8").trim();
                            console.log("Received fingerprint ID:", rawData);

                            // Send the fingerprint ID to all WebSocket clients
                            wsServer.clients.forEach((client) => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({ fingerprintID: rawData }));
                                }
                            });
                        });

                        resolve("Bluetooth started successfully");
                    }, () => {
                        reject("Failed to connect to HC-05");
                    });
                });
            }
        });

        btSerial.on("finished", () => {
            console.log("Bluetooth device scan finished");
        });
    });
};

// Function to stop Bluetooth connection
const stopBluetooth = () => {
    return new Promise((resolve) => {
        if (btSerial) {
            btSerial.close();
            btSerial = null;
            isBluetoothConnected = false;
            console.log("Bluetooth connection stopped.");
            resolve("Bluetooth stopped successfully");
        } else {
            resolve("Bluetooth was not running");
        }
    });
};

// Toggle Bluetooth endpoint
app.post("/toggle-server", async (req, res) => {
    const { action } = req.body;

    try {
        if (action === "start" && !isBluetoothConnected) {
            const message = await startBluetooth();
            res.json({ success: true, message });
        } else if (action === "stop" && isBluetoothConnected) {
            const message = await stopBluetooth();
            res.json({ success: true, message });
        } else {
            res.json({ success: false, message: "Invalid action or already in the requested state" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
});

// Start Express server
app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
});
