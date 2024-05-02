import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentsController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductsController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productImageController,
  productListController,
  searchProductController,
  similarProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
import braintree from "braintree";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-products", getProductsController);

//get single product
router.get("/get-product/:slug", getSingleProductController);

//get image route. beacuse we used select("-image") in productController. so we create seperate API for image
router.get("/product-image/:pid", productImageController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product (SERVER SIDE FILTERING)
router.post("/product-filters", productFiltersController); //post because we passing data

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//product search
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/similar-products/:pid/:cid", similarProductController); //pid is used not to show that particular product in related products again

//category wise products
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, braintreePaymentsController);
//Formidable is a Node.js module for parsing form data, including multipart/form-data file upload.
export default router;
