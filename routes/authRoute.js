import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  getUserOrdersController,
  getAllOrdersController,
  orderStatusController,
  authController,
  allUsersController,
  toggleAdminPermissionController,
  toggleUserStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot password || POST
router.post("/forgot-password", forgotPasswordController);

//protected user route auth
router.get("/user-auth", requireSignIn, authController);

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//User - orders
router.get("/orders", requireSignIn, getUserOrdersController);

//Admin - all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update (shown in admin dashboard=>orders)
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController,
);

//get users (To show in Admin dashboard)
router.get("/all-users", requireSignIn, isAdmin, allUsersController);

//Make a user as an Admin
router.patch(
  "/users/:id/toggle-role",
  requireSignIn,
  isAdmin,
  toggleAdminPermissionController,
);

//activate or deactivate user
router.patch(
  "/users/:id/toggle-status",
  requireSignIn,
  isAdmin,
  toggleUserStatusController,
);
export default router;
