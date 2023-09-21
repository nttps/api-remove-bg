const express = require("express");
const { spawn } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const WebSocket = require("ws");
const path = require("path");
const http = require("http");
const cors = require("cors");
const upload = require("./utils/upload")

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (e.g., processed images)
app.use("/uploads", express.static("uploads"));
app.use(cors());
// Serve static files in the "public" directory (for displaying images)
app.use(express.static(path.join(__dirname, 'public')));


const getServerImageUrl = (imageFileName) =>
    `http://localhost:${port}/processed-images/${imageFileName}`;

// Define a route for the file upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.use("/public", express.static("public"));

 const dateDir = new Date().toLocaleDateString("en-ca");
// Define a route to handle file uploads
app.post("/upload", upload(dateDir).single("file"), async (req, res) => {

    console.log(req.file);

    console.log(req.body);
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const processedImagesDir = path.join(`./processed_images/${dateDir}`);

        if (!existsSync(processedImagesDir)) {
            mkdirSync(processedImagesDir);
        }
        const inputImagePath = req.file.path;
        const outputImageName = Date.now() + ".png";
        const outputImagePath = `${processedImagesDir}/${outputImageName}`;

        let progress = 0;

        const pythonProcess = spawn("python", [
            "remove_bg.py",
            inputImagePath,
            outputImagePath,
        ]);

        pythonProcess.stdout.on("data", (data) => {
            console.log(`Python stdout: ${data}`);
        });
        
        // Listen for progress updates from the Python script
        pythonProcess.stderr.on("data", (data) => {
            console.log(data);
            console.log('โหลด');


            const message = data.toString().trim();

            console.log(message);
            // Check if the message contains progress information
            if (/^\d+(\.\d+)?%$/.test(message)) {
                const parsedProgress = parseFloat(message);
                if (!isNaN(parsedProgress)) {
                    progress = parsedProgress;

                    // Send progress to all connected WebSocket clients
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(progress.toString());
                        }
                    });
                }
            } else {
                // Send other messages to WebSocket clients (e.g., error messages)
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message);
                    }
                });
            }
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                // Processing is complete
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send("done");
                    }
                });

                return res.json({
                    success: true,
                    url: getServerImageUrl(`${dateDir}/${outputImageName}`),
                });
            } else {
                res.status(500).send("Error removing background.");
            }
        });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("An error occurred during image processing.");
    }
});

app.use(
    "/processed-images",
    express.static(path.join(__dirname, "/processed_images"))
);
wss.on("connection", (ws) => {
    console.log("WebSocket connection established.");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
