import slugify from "slugify";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import stripe from "../config/stripe.js";
import orderModel from "../models/orderModel.js";

dotenv.config();

export const createProductController = async (req, res) => {
  try {
    let { name, description, price, image, category, quantity, brand } =
      req.body;
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    // Validation
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });

    if (!image || !image.trim())
      return res
        .status(400)
        .json({ success: false, message: "Image url is required" });

    if (!name || !name.trim())
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    if (!description || !description.trim())
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });

    if (!price || price == null || isNaN(parsedPrice))
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });

    if (!quantity || quantity == null || isNaN(parsedQuantity))
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number",
      });

    if (parsedPrice < 0)
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });

    if (parsedQuantity < 0)
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });

    if (!brand || !brand.trim())
      return res
        .status(400)
        .json({ success: false, message: "Brand is required" });

    // Normalize
    name = name.trim();
    description = description.trim();
    brand = brand.trim();
    image = image.trim();
    price = parsedPrice;
    quantity = parsedQuantity;

    // Optional: check duplicate
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(409).send({
        success: false,
        message: "Product already exists",
      });
    }

    // validate category
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(400).send({
        success: false,
        message: "Invalid category",
      });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image,
      slug: slugify(name, { lower: true }),
    });

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in product creation",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

//get all products
export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(100)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All Products",
      productsCount: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error in getting products",
    });
  }
};

//get single product from slug
export const getSingleProductController = async (req, res) => {
  try {
    let { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).send({
        success: false,
        message: "Product slug is required",
      });
    }

    slug = slug.trim().toLowerCase();

    const product = await productModel
      .findOne({ slug })
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in getting single product",
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct, // optional
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error in deleting product",
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    let { name, description, price, image, category, quantity, brand } =
      req.body;

    const id = req.params.pid;
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });

    // Validation
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });

    if (!image || !image.trim())
      return res
        .status(400)
        .json({ success: false, message: "Image url is required" });

    if (!name || !name.trim())
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    if (!description || !description.trim())
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });

    if (!price || price == null || isNaN(parsedPrice))
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });

    if (!quantity || quantity == null || isNaN(parsedQuantity))
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number",
      });

    if (parsedPrice < 0)
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });

    if (parsedQuantity < 0)
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });

    if (!brand || !brand.trim())
      return res
        .status(400)
        .json({ success: false, message: "Brand is required" });

    // Normalize
    name = name.trim();
    description = description.trim();
    brand = brand.trim();
    image = image.trim();
    price = parsedPrice;
    quantity = parsedQuantity;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        image,
        slug: slugify(name, { lower: true }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in updating product",
    });
  }
};

//filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    // Category filter
    if (checked?.length > 0) {
      args.category = { $in: checked };
    }

    // Price filter
    if (radio?.length === 2) {
      args.price = {
        $gte: Number(radio[0]),
        $lte: Number(radio[1]),
      };
    }

    const products = await productModel
      .find(args)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      products,
      productsCount: products.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error while filtering products",
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const totalProductsCount = await productModel.estimatedDocumentCount();

    return res.status(200).send({
      success: true,
      totalProductsCount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error while getting product count",
    });
  }
};

//product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 12;

    let page = parseInt(req.params.page) || 1;
    if (page < 1) page = 1;

    const totalProducts = await productModel.countDocuments();

    const products = await productModel
      .find({})
      .populate("category", "name slug")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalProducts / perPage);

    return res.status(200).send({
      success: true,
      products,
      currentPage: page,
      perPage,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error while fetching products",
    });
  }
};

//search controller
export const searchProductController = async (req, res) => {
  try {
    let { keyword } = req.params;

    if (!keyword || !keyword.trim()) {
      return res.status(400).send({
        success: false,
        message: "Search keyword is required",
      });
    }

    keyword = keyword.trim();

    // Escape regex special characters
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const safeKeyword = escapeRegex(keyword);

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: safeKeyword, $options: "i" } },
          { brand: { $regex: safeKeyword, $options: "i" } },
        ],
      })
      .populate("category", "name slug")
      .limit(20)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error while searching products",
    });
  }
};

//similar products
export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    if (!pid || !cid) {
      return res.status(400).send({
        success: false,
        message: "Product ID and Category ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(pid) ||
      !mongoose.Types.ObjectId.isValid(cid)
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product ID or Category ID",
      });
    }

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("name price image slug category brand")
      .populate("category", "name slug")
      .limit(4)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      products,
      productsCount: products.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error while getting similar products",
    });
  }
};

//get products by category
export const productCategoryController = async (req, res) => {
  try {
    let { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).send({
        success: false,
        message: "Category slug is required",
      });
    }

    slug = slug.trim().toLowerCase();

    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    const products = await productModel
      .find({ category: category._id })
      .select("name price image brand slug category")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      category,
      products,
      productsCount: products.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Server Error in getting category-wise products",
    });
  }
};

//check stock
export const checkStockBulkController = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ✅ Collect all product IDs
    const productIds = cart.map((item) => item._id);

    // ✅ Fetch all products in one query (OPTIMIZED)
    const products = await productModel.find({
      _id: { $in: productIds },
    });

    // ✅ Create map for quick lookup
    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    // ✅ Validate each cart item
    for (const item of cart) {
      const product = productMap[item._id];

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.quantity === 0) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.quantity} items available for ${product.name}`,
          available: product.quantity,
          productId: product._id,
        });
      }
    }

    // ✅ All good
    return res.status(200).json({
      success: true,
      message: "Stock available",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error checking stock",
      error: error.message,
    });
  }
};

//payment gateway api
export const createPaymentIntentController = async (req, res) => {
  try {
    const { cart } = req.body;

    // calculate total
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // convert to paise
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating payment intent");
  }
};

//save order
export const saveOrderController = async (req, res) => {
  try {
    const { cart, paymentIntent } = req.body;

    // ✅ 1. Validate payment
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    // ✅ 2. STOCK CHECK (VERY IMPORTANT)
    for (const item of cart) {
      const product = await productModel.findById(item._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
          available: product.quantity,
        });
      }
    }

    // ✅ 3. CREATE ORDER
    const newOrder = await new orderModel({
      products: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      payment: paymentIntent,
      buyer: req.user._id,
    }).save();

    // ✅ 4. DECREMENT STOCK
    for (const item of cart) {
      await productModel.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -item.quantity } },
        { new: true },
      );
    }

    // ✅ 5. RESPONSE
    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error saving order",
      error: error.message,
    });
  }
};
