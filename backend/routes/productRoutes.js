const express = require("express");
const db = require("../config/db");
const blockchain = require("../utils/blockchain");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Product Registration (Seller)
router.post("/register", async (req, res) => {
    const { seller_id, name, brand, serial_number } = req.body;

    // Step 1: Store on Blockchain
    const blockchainHash = await blockchain.registerProduct(serial_number);

    if (!blockchainHash) {
        return res.status(500).json({ error: "Blockchain registration failed" });
    }

    // Step 2: Generate QR Code
    const qrCodePath = `public/qrcodes/${serial_number}.png`;
    const qrCode = qr.image(serial_number, { type: "png" });
    qrCode.pipe(fs.createWriteStream(qrCodePath));

    // Step 3: Store in MySQL
    db.query(
        "INSERT INTO products (seller_id, name, brand, serial_number, blockchain_hash, qr_code) VALUES (?, ?, ?, ?, ?, ?)",
        [seller_id, name, brand, serial_number, blockchainHash, qrCodePath],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product registered successfully", blockchainHash });
        }
    );
});

router.post("/verify", async (req, res) => {
    const { serial_number } = req.body;

    db.query("SELECT * FROM products WHERE serial_number = ?", [serial_number], async (err, products) => {
        if (err || products.length === 0) return res.status(400).json({ error: "Product not found" });

        const product = products[0];

        // Verify authenticity from Blockchain
        const isValid = await blockchain.verifyProduct(product.serial_number);
        res.json({ product, verified: isValid });
    });
});

module.exports = router;
