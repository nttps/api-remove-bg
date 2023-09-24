
const express = require("express");
const { existsSync, mkdirSync } = require("fs");
const { spawn } = require("child_process");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


const upload = require("../utils/upload");

const router = express.Router();


// Define a route to handle file uploads
router.post("/upload-file", upload().single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const dateDir = new Date().toLocaleDateString("en-ca");

    try {
        const processedImagesDir = path.join(`./processed_images/${dateDir}`);

        if (!existsSync(processedImagesDir)) {
            mkdirSync(processedImagesDir);
        }
        const inputImagePath = req.file.path;
        const outputImageName = Date.now() + ".png";
        const outputImagePath = `${processedImagesDir}/${outputImageName}`;

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
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {

                fs.rmSync(inputImagePath);

                const input = sharp(`${outputImagePath}`);
                input.toBuffer(function (err, data) {

                    fs.rmSync(outputImagePath);

                    res.header("Content-Type", "image/png")
                        .status(200)
                        .send(data);
                });
                // Processing is complete
                // return res.json({
                //     success: true,
                //     url: getServerImageUrl(`${dateDir}/${outputImageName}`),
                // });
            } else {
                res.status(500).send("Error removing background.");
            }
        });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).send("An error occurred during image processing.");
    }
});


module.exports = router;
