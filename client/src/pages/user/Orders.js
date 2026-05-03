import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import moment from "moment";

import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/authContext";
import API from "../../api/axios";

const Orders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const getOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/auth/orders");
      setOrders(data?.orders || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  // Payment status mapping
  const paymentStatus = useCallback((status) => {
    switch (status) {
      case "succeeded":
        return "Success";
      case "processing":
        return "Processing";
      case "requires_payment_method":
        return "Failed";
      default:
        return "Pending";
    }
  }, []);

  useEffect(() => {
    if (auth?.user) getOrders();
  }, [auth?.user, getOrders]);

  return (
    <Layout title={"Your Orders"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ================= LEFT MENU ================= */}
        <div>
          <UserMenu />
        </div>

        {/* ================= ORDERS ================= */}
        <div className="md:col-span-3">
          <h1 className="text-xl font-bold text-center mb-6">
            {orders.length
              ? `Number of orders: ${orders.length}`
              : "No orders found"}
          </h1>

          <div className="space-y-6">
            {orders.map((o, i) => {
              const totalQty = o.products.reduce(
                (acc, item) => acc + item.quantity,
                0,
              );

              return (
                <div key={o._id} className="bg-white rounded-xl shadow-md p-4">
                  {/* ===== ORDER HEADER ===== */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Buyer</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Payment</th>
                          <th className="p-2">Total Qty</th>
                          <th className="p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">{o?.status}</td>
                          <td className="p-2">{o?.buyer?.name}</td>
                          <td className="p-2">
                            {moment(o?.createdAt).fromNow()}
                          </td>
                          <td className="p-2">
                            {paymentStatus(o?.payment?.status)}
                          </td>
                          <td className="p-2">{totalQty}</td>
                          <td className="p-2">Rs {o?.payment?.amount / 100}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* ===== PRODUCTS ===== */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {o?.products?.map((item) => {
                      const p = item.product;

                      return (
                        <div
                          key={p._id}
                          className="flex gap-4 bg-gray-50 p-3 rounded-lg"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />

                          <div>
                            <h4 className="font-semibold">{p.name}</h4>
                            <p className="text-sm text-gray-500">
                              by {p.brand}
                            </p>
                            <p className="font-bold text-indigo-600">
                              ₹ {p.price}
                            </p>

                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
