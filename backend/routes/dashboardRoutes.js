const router = require("express").Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");

router.get("/stats", auth, async (req, res) => {
  try {
    const [total, available, issued, categories] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ status: "Available" }),
      Book.countDocuments({ status: "Issued" }),
      Book.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    ]);

    res.json({ total, available, issued, categories });
  } catch {
    res.status(500).json({ message: "Unable to fetch dashboard statistics" });
  }
});

module.exports = router;
