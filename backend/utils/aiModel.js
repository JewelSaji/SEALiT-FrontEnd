const { exec } = require("child_process");

const detectFake = async (imagePath) => {
    return new Promise((resolve, reject) => {
        exec(`python detect.py --source ${imagePath} --weights yolov5s.pt`, (error, stdout) => {
            if (error) {
                console.error("AI Detection Error:", error);
                return reject("Error processing image");
            }
            resolve(stdout.includes("FAKE") ? "fake" : "real");
        });
    });
};

module.exports = { detectFake };
