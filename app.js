require("dotenv").config();

const express = require("express");
const { readdirSync } = require("fs");
const path = require("path");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const folderRoutes = "routes";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (e.g., processed images)
app.use("/uploads", express.static("uploads"));
app.use(cors());
// Serve static files in the "public" directory (for displaying images)
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the file upload form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/public", express.static("public"));

readdirSync(`./${folderRoutes}`).map((r) =>
    app.use("/", require(`./${folderRoutes}/${r}`))
);

app.use(
    "/processed-images",
    express.static(path.join(__dirname, "/processed_images"))
);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
