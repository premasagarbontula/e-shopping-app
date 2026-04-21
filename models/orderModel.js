import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users", //from user model
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: {
        values: [
          "Not Processed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
        message: "{VALUE} is not a valid order status!",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("order", orderSchema);
