import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Select } from "antd";
import toast from "react-hot-toast";

import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/authContext";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const { Option } = Select;

const AdminOrders = () => {
  const { auth } = useAuth();

  const [statusList] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);

  const [orders, setOrders] = useState([]);

  // fetch all orders
  const getOrders = useCallback(async () => {
    try {
      const { data } = await API.get("/auth/all-orders");
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  useEffect(() => {
    if (auth?.user) getOrders();
  }, [auth?.user, getOrders]);

  // payment status
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

  // update order status
  const handleChange = useCallback(
    async (orderId, value) => {
      try {
        await API.put(`/auth/order-status/${orderId}`, {
          status: value,
        });
        getOrders();
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [getOrders],
  );

  return (
    <Layout title={"All Orders"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-500">
            All Orders
          </h1>

          <div className="space-y-6">
            {orders.map((o, i) => {
              const totalQty = o.products.reduce(
                (acc, item) => acc + item.quantity,
                0,
              );

              return (
                <div key={o._id} className="bg-white rounded-xl shadow-md p-4">
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

                          <td className="p-2">
                            <Select
                              bordered={false}
                              value={o?.status}
                              onChange={(value) => handleChange(o._id, value)}
                            >
                              {statusList.map((s, idx) => (
                                <Option key={idx} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>

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

export default AdminOrders;
