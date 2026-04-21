import slugify from "slugify";
import mongoose from "mongoose";

import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

//create category
export const createCategoryController = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    const formattedName = capitalizeWords(name.trim());

    const existingCategory = await categoryModel.findOne({
      name: formattedName,
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    const category = await categoryModel.create({
      name: formattedName,
      slug: slugify(formattedName, { lower: true }),
    });

    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Server Error while creating Category",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Category ID is required",
      });
    }

    const formattedName = capitalizeWords(name.trim());

    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate check (excluding current category). Renaming to an existing category should give error
    const duplicate = await categoryModel.findOne({
      name: formattedName,
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(409).send({
        success: false,
        message: "Category with this name already exists",
      });
    }

    existingCategory.name = formattedName;
    existingCategory.slug = slugify(formattedName, { lower: true });

    await existingCategory.save();

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category: existingCategory,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Server Error while updating Category",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

//get all categories
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({})
      .select("name slug")
      .sort({ name: 1 });

    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error getting all categories",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
//get single category
export const singleCategoryController = async (req, res) => {
  try {
    let { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).send({
        success: false,
        message: "Category slug is required",
      });
    }

    slug = slug.trim().toLowerCase();

    const category = await categoryModel
      .findOne({ slug })
      .select("name slug")
      .lean();

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error getting Single Category",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Category ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Category ID",
      });
    }

    // Prevent deletion if category is used
    const products = await productModel.findOne({ category: id });
    if (products) {
      return res.status(400).send({
        success: false,
        message: "Cannot delete category with associated products",
      });
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Server error while deleting category",
    });
  }
};
