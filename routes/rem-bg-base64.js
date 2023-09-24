const express = require("express");
const { Rembg } = require("rembg-node");
const sharp = require("sharp");
const fs = require("fs");

const upload = require("../utils/upload");
const router = express.Router();


router.post("/rem-bg",  upload().single("file") , async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const input = sharp(`${req.file.path}`);

    // optional arguments
    const rembg = new Rembg({
        logging: true,
    });

    const output = await rembg.remove(input);
    fs.rmSync(req.file.path);

    output.png().toBuffer(function (err, data) {
        res.header("Content-Type", "image/png").status(200).send(data);
    });



})

module.exports = router;
