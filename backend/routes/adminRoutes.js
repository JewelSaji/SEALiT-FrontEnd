router.post("/blacklist/:id", (req, res) => {
    const seller_id = req.params.id;

    db.query("UPDATE users SET trust_score = 0 WHERE id = ?", [seller_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Seller blacklisted" });
    });
});
