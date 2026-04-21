import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    minlength: [2, "Category name must be at least 2 characters long"],
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model("category", categorySchema);
