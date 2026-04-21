import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "User name should be atleast 3 characters"],
      maxlength: [25, "User name is too long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
          }),
        message:
          "Password must include uppercase,lowercase,number and special character",
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isMobilePhone(v, "en-IN"),
        message: "Please provide a valid phone number",
      },
    },
    address: {
      type: String,
      required: true,
      minlength: [5, "Address is too small"],
      maxlength: [100, "Address is too long"],
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role!",
      },
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("users", userSchema);
