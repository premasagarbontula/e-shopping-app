import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware to check if user is signed in using JWT
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);

    // Fetch user here
    const user = await userModel
      .findById(decode._id)
      .select("-password -answer");

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }
    if (!user.isActive) {
      return res.status(403).send({
        success: false,
        message: "Account is deactivated. Contact admin.",
      });
    }
    // Attach full user
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
};

// Middleware to check if signed in user is an admin
export const isAdmin = (req, res, next) => {
  const isAdminUser = req.user?.role === "admin";

  if (!isAdminUser) {
    return res.status(403).send({
      success: false,
      message: "Unauthorized Access",
    });
  }

  next();
};
