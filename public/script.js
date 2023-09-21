document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const imageInput = document.getElementById("image-input");
    const progressContainer = document.getElementById("progress-container");
    const uploadProgress = document.getElementById("upload-progress");
    const progressLabel = document.getElementById("progress-label");
    const processedImage = document.getElementById("processed-image");
;
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", imageInput.files[0]);

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                uploadProgress.style.width = percentComplete + "%";
                progressLabel.textContent = percentComplete.toFixed(2) + "%";
            }
        });

        // Handle upload completion
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    processedImage.src = data.url;
                    
                    progressContainer.style.display = "none";
                } else {
                    console.error("Error uploading file");
                }
            }
        };

        xhr.open("POST", "/upload", true);
        xhr.send(formData);

        progressContainer.style.display = "block";
    });

    const progressElement = document.getElementById("progress");
    const socket = new WebSocket("ws://localhost:3000");
    

    socket.addEventListener("message", (event) => {
        const progress = parseFloat(event.data);
        if (!isNaN(progress)) {
            progressElement.textContent = `Progress: ${progress.toFixed(2)}%`;
        }
    });

    socket.addEventListener("open", () => {
        console.log("WebSocket connected.");
    });

    socket.addEventListener("close", (event) => {
        if (event.wasClean) {
            console.log(
                `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`
            );
        } else {
            console.error("WebSocket connection died");
        }
    });

    socket.addEventListener("error", (error) => {
        console.error(`WebSocket error: ${error.message}`);
    });
});
