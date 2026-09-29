const router = require("express").Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "All", status = "All" } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } }
      ];
    }
    if (category !== "All") query.category = category;
    if (status !== "All") query.status = status;

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch {
    res.status(500).json({ message: "Unable to fetch books" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Invalid book id" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, category } = req.body;
    if (!title || !author || !category) {
      return res.status(400).json({ message: "Title, author and category are required" });
    }
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch {
    res.status(400).json({ message: "Could not create book" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Could not update book" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status, borrower = "", dueDate = null } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status, borrower: status === "Issued" ? borrower : "", dueDate: status === "Issued" ? dueDate : null },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "Could not update book status" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(400).json({ message: "Could not delete book" });
  }
});

module.exports = router;
