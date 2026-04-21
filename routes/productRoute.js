import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  searchProductController,
  similarProductController,
  updateProductController,
  createPaymentIntentController,
  saveOrderController,
  checkStockBulkController,
} from "../controllers/productController.js";

const router = express.Router();

//routes
router.post("/create-product", requireSignIn, isAdmin, createProductController);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  updateProductController,
);

//get products
router.get("/get-products", getProductsController);

//get single product
router.get("/get-product/:slug", getSingleProductController);

//delete product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController,
);

//filter product (SERVER SIDE FILTERING)
router.post("/product-filters", productFiltersController); //post because we passing data

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//product search
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/similar-products/:pid?/:cid", similarProductController); //pid is used not to show that particular product in similar products again

//category wise products
router.get("/product-category/:slug", productCategoryController);

//check Stock
router.post("/check-stock-bulk", requireSignIn, checkStockBulkController);

//payments routes
// create payment intent
router.post(
  "/stripe/create-payment-intent",
  requireSignIn,
  createPaymentIntentController,
);

// save order
router.post("/stripe/save-order", requireSignIn, saveOrderController);

export default router;
