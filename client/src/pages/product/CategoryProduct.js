import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import { useCart } from "../../context/cartContext";
import API from "../../api/axios";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { cart, addToCart, updateQuantity } = useCart();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  const getCartItem = (id) => cart.find((item) => item._id === id);

  const getProductsByCategory = useCallback(async () => {
    try {
      const { data } = await API.get(
        `/product/product-category/${params.slug}`,
      );

      setProducts(data?.products || []);
      setCategory(data?.category || null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, [params.slug]);

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params?.slug, getProductsByCategory]);

  return (
    <Layout title={`Category - ${category?.name || ""}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Category:{" "}
            <span className="text-indigo-600">
              {category?.name || "Loading..."}
            </span>
          </h1>
          <p className="text-gray-500 mt-2">{products.length} results found</p>
        </div>

        {/* ================= PRODUCTS ================= */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No products found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const cartItem = getCartItem(p._id);

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>
                      <span className="text-yellow-500 text-sm">
                        ⭐ {p.rating || "4.5"}
                      </span>
                    </div>

                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>by {p.brand}</span>
                      <span className="font-bold text-indigo-600">
                        ₹ {p.price}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2 items-center">
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Details
                      </button>

                      {p.quantity === 0 ? (
                        <span className="text-red-500 font-semibold text-sm">
                          Out of Stock
                        </span>
                      ) : cartItem ? (
                        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                          <button
                            onClick={() => updateQuantity(p._id, "dec")}
                            className="px-2 text-lg font-bold"
                          >
                            -
                          </button>

                          <span className="min-w-[20px] text-center">
                            {cartItem.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(p._id, "inc")}
                            className="px-2 text-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
