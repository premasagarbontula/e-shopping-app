import mongoose from "mongoose";
import validator from "validator";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// register controller
export const registerController = async (req, res) => {
  try {
    let { name, email, password, phone, address, answer } = req.body;

    name = name?.trim(); // to handle undefined values, we use optional chaining
    email = email?.trim().toLowerCase();
    password = password?.trim();
    phone = phone?.trim();
    address = address?.trim();
    answer = answer?.trim();

    // Validation
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Username is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }
    if (!answer) {
      return res
        .status(400)
        .json({ success: false, message: "Answer is required" });
    }
    // user already exists
    const existingUser = await userModel.findOne({
      email,
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with Email already exists",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 characters",
      });
    }

    const validPassword = validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    });
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password must include uppercase,lowercase,number and special character",
      });
    }

    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(answer);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer: hashedAnswer,
      isActive: true,
    }).save();

    const userObj = user.toObject(); //not pass password to response
    delete userObj.password;
    delete userObj.answer;

    // successful registration
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with Email already exists",
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase(); // to handle undefined values, we use optional chaining
    password = password?.trim();

    // Missing credentials
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // User not found
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (!user.isActive) {
      return res.status(403).send({
        success: false,
        message: "Account is deactivated. Contact admin.",
      });
    }
    // Password mismatch
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

// forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    let { email, answer, newPassword } = req.body;

    email = email?.trim().toLowerCase(); // to handle undefined values, we use optional chaining
    answer = answer?.trim();
    newPassword = newPassword?.trim();

    // Validate required fields early and return immediately
    if (!email || !answer || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isPasswordStrong = validator.isStrongPassword(newPassword, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isPasswordStrong) {
      return res.status(400).json({
        success: false,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }

    // Find user with matching email and security answer
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or answer" });
    }

    const isMatch = await comparePassword(answer, user.answer);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or answer",
      });
    }

    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash new password securely
    const hashedPassword = await hashPassword(newPassword);

    // Update password in DB
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    //await userModel.updateOne({ email }, { password: hashedPassword });

    // Send success response (200 OK)
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
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
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }
    // Internal Server Error for unexpected issues
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    let { name, address, phone } = req.body;

    name = name?.trim();
    address = address?.trim();
    phone = phone?.trim();

    if (!name || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (phone && !validator.isMobilePhone(phone, "en-IN")) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { name, phone, address },
        { new: true, runValidators: true },
      )
      .select("-password -answer");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// orders
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products.product")
      .populate("buyer", "name");

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

// all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error: error.message,
    });
  }
};

// order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { runValidators: true, new: true },
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating order status",
      error: error.message,
    });
  }
};

// user auth
export const authController = (req, res) => {
  res.status(200).send({
    ok: true,
    user: req.user,
  });
};

// all users
export const allUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error in allUsersController:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// make user as Admin
export const toggleAdminPermissionController = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid User ID",
      });
    }

    if (req.user._id.equals(id)) {
      return res.status(400).send({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.isActive === false) {
      return res.status(400).send({
        success: false,
        message: "Inactive user cannot be assigned admin role",
      });
    }
    const newRole = user.role === "admin" ? "user" : "admin";

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { role: newRole }, { new: true })
      .select("name email role");

    return res.status(200).send({
      success: true,
      message: `${updatedUser.name}'s role has been changed to ${
        updatedUser.role === "admin" ? "Admin" : "User"
      }`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in toggleAdminPermissionController:", error);

    res.status(500).json({
      success: false,
      message: "Error toggling user role",
      error: error.message,
    });
  }
};

// activate/deactivate user
export const toggleUserStatusController = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Auth check
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid User ID",
      });
    }

    // 3. Prevent self deactivate
    if (req.user._id.equals(id)) {
      return res.status(400).send({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    // 4. Find user
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // 5. Toggle status
    const newStatus = !user.isActive;

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { isActive: newStatus }, { new: true })
      .select("name email role isActive");

    return res.status(200).send({
      success: true,
      message: `${updatedUser.name} has been ${
        updatedUser.isActive ? "activated" : "deactivated"
      }`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in toggleUserStatusController:", error);

    res.status(500).json({
      success: false,
      message: "Error updating user status",
      error: error.message,
    });
  }
};
