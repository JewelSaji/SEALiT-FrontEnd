const multer = require("multer");
const aiModel = require("../utils/aiModel");

const upload = multer({ dest: "public/uploads/" });

router.post("/report", upload.single("image"), async (req, res) => {
    const { buyer_id, product_id } = req.body;
    const imageUrl = `/public/uploads/${req.file.filename}`;

    // AI Detection
    const aiResult = await aiModel.detectFake(imageUrl);

    db.query(
        "INSERT INTO fraud_reports (buyer_id, product_id, image_url, ai_detected) VALUES (?, ?, ?, ?)",
        [buyer_id, product_id, imageUrl, aiResult],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Fraud report submitted", aiResult });
        }
    );
});
