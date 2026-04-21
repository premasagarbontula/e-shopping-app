import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Layout from "../../components/layout/Layout";
import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/authContext";
import EmptyCartPage from "../../pages/cart/EmptyCartPage";
import API from "../../api/axios";

const CartPage = () => {
  const { cart, updateQuantity, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const totalPrice = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    return total.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  }, [cart]);

  const totalQty = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const handlePayment = useCallback(async () => {
    try {
      if (!stripe || !elements) return;

      setLoading(true);

      // STOCK CHECK BEFORE PAYMENT
      await API.post("/product/check-stock-bulk", { cart });

      // CREATE PAYMENT INTENT
      const { data } = await API.post("/product/stripe/create-payment-intent", {
        cart,
      });

      // CONFIRM PAYMENT
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        try {
          // SAVE ORDER
          await API.post("/product/stripe/save-order", {
            cart,
            paymentIntent: result.paymentIntent,
          });

          toast.success("Payment Successful");

          localStorage.removeItem("cart");
          clearCart();
          navigate("/dashboard/user/orders");
        } catch (err) {
          console.log(err);
          toast.error("Order saved failed. Contact support.");
        }
      }

      setLoading(false);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }

      setLoading(false);
    }
  }, [stripe, elements, cart, navigate, clearCart]);

  if (!cart.length) {
    return (
      <Layout>
        <EmptyCartPage />
      </Layout>
    );
  }

  return (
    <Layout title={"Your Cart"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= LEFT: CART ITEMS ================= */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-xl font-bold">
            {auth?.user ? `Hello ${auth.user.name}` : "Your Cart"}
          </h1>

          <p className="text-gray-500">
            You have {totalQty} item(s) in your cart
          </p>

          {cart.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-500">by {p.brand}</p>
                <p className="font-bold text-indigo-600">₹ {p.price}</p>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <button
                  onClick={() => updateQuantity(p._id, "dec")}
                  className="px-2 text-lg font-bold"
                >
                  -
                </button>

                <span className="min-w-[20px] text-center">{p.quantity}</span>

                <button
                  onClick={() => updateQuantity(p._id, "inc")}
                  className="px-2 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="bg-white p-5 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-2">Cart Summary</h2>
          <p className="text-gray-500 mb-4">Checkout</p>

          <h4 className="text-lg font-semibold mb-4">Total: {totalPrice}</h4>

          {auth?.user?.address ? (
            <div className="mb-4">
              <h4 className="font-semibold">Shipping Address:</h4>
              <p className="text-sm text-gray-600">{auth.user.address}</p>

              <button
                onClick={() => navigate("/dashboard/user/profile")}
                className="mt-2 text-sm text-indigo-600 underline"
              >
                Update Address
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login", { state: "/cart" })}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg mb-4"
            >
              Please Login to Checkout
            </button>
          )}

          <div className="mb-3 p-3 border rounded">
            <CardElement />
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !auth?.user?.address}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Processing..." : "Make Payment"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
