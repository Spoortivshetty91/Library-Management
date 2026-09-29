const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  isbn: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
  coverUrl: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["Available", "Issued"], default: "Available" },
  borrower: { type: String, trim: true, default: "" },
  dueDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
