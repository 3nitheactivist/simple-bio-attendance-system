const WebSocket = require("ws");
const BluetoothSerialPort = require("bluetooth-serial-port").BluetoothSerialPort;

const wsServer = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

wsServer.on("connection", (ws) => {
    console.log("Client connected");

    // Send test fingerprint data every 5 seconds
    setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send("Test Data: Fingerprint ID 12345");
            console.log("Sent test fingerprint data");
        }
    }, 5000); 

    ws.on("close", () => console.log("Client disconnected"));
});

// Bluetooth Code (You can keep or comment this for now)
const btSerial = new BluetoothSerialPort();
btSerial.inquire();

btSerial.on("found", (address, name) => {
    console.log(`Found Bluetooth device: ${name} (${address})`);
});

btSerial.on("finished", () => {
    console.log("Bluetooth device scan finished");
});
