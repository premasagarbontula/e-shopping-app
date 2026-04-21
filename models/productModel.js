import mongoose from "mongoose";
import validator from "validator";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      unique: true, // usually slugs must be unique for SEO
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Price must be a valid number",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // as category has seperate model(a id will be created when a new category created)
      ref: "category", //(model name in category model is 'category')
      required: [true, "Category is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Quantity must be a valid number",
      },
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
      validate: {
        validator: (value) => {
          return validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: "Provide a valid image URL (http/https only)",
      },
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },
    shipping: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("products", productSchema); //if we write 'Product',in database it will change to 'products'(lowercase)
