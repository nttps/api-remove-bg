
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
    
    try {
        const processedImagesDir = path.join(`./processed_images`);

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
        
        pythonProcess.on("close", (code) => {
            if (code === 0) {

                fs.rmSync(inputImagePath);
                const input = sharp(`${outputImagePath}`);
                input.png().toBuffer(function (err, data) {

                    fs.rmSync(outputImagePath);

                    res.header("Content-Type", "image/png")
                        .status(200)
                        .send(data);
                });
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
