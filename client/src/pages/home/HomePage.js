import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import { Prices } from "../../constants/Prices";
import { useCart } from "../../context/cartContext";
import { useSearch } from "../../context/searchContext";
import API from "../../api/axios";
import Spinner from "../../components/common/Spinner";

const HomePage = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();
  const { setSearch } = useSearch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ get cart item
  const getCartItem = (id) => cart.find((item) => item._id === id);

  // ✅ Add to cart handler
  const handleAdd = (product) => {
    if (product.quantity === 0) {
      return toast.error("Out of stock");
    }
    addToCart(product);
    toast.success(`${product.name} is added to cart`);
  };

  // ✅ API calls
  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await API.get("/category/get-category");
      setCategories(data?.categories || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/product/product-list/1`);

      setProducts(data?.products || []);

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }, []);

  const getTotalCount = useCallback(async () => {
    try {
      const { data } = await API.get("/product/product-count");

      setTotalCount(data?.totalProductsCount || 0);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  const filterProduct = useCallback(async () => {
    try {
      const { data } = await API.post(`/product/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, [checked, radio]);

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/product/product-list/${page}`);
      setProducts((prev) => [...prev, ...(data?.products || [])]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }, [page]);

  // ✅ effects
  useEffect(() => {
    setSearch({ keyword: "", results: [] });
  }, [setSearch]);

  useEffect(() => {
    getAllCategory();
    getTotalCount();
  }, [getAllCategory, getTotalCount]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore]);

  useEffect(() => {
    if (!checked.length && !radio.length && page === 1) getAllProducts();
  }, [checked.length, radio.length, page, getAllProducts]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio, filterProduct]);

  return (
    <Layout title={"All Products - Best Offers"}>
      <div className="max-w-8xl ml-2 px-2 py-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* ================= LEFT FILTER ================= */}
        <div className="bg-white p-5 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">
            Filter by Category
          </h2>

          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setChecked((prev) =>
                    e.target.checked
                      ? [...prev, c._id]
                      : prev.filter((id) => id !== c._id),
                  )
                }
                className="mt-0.5"
              />
              {c.name}
            </label>
          ))}

          <h2 className="text-xl font-semibold text-indigo-600 mt-6 mb-2">
            Filter by Price
          </h2>

          {Prices.map((p) => (
            <label key={p._id} className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                onChange={() => setRadio(p.array)}
              />
              {p.name}
            </label>
          ))}

          <button
            onClick={() => window.location.reload()}
            className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="md:col-span-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
            All Products
          </h1>
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => {
                const cartItem = getCartItem(p._id);

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-indigo-600 font-bold">₹ {p.price}</p>

                      <div className="mt-4 flex gap-2 items-center">
                        {/* DETAILS */}
                        <button
                          onClick={() => navigate(`/product/${p.slug}`)}
                          className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg"
                        >
                          Details
                        </button>

                        {p.quantity === 0 ? (
                          <span className="text-red-500 text-sm">
                            Out of Stock
                          </span>
                        ) : cartItem ? (
                          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg">
                            <button
                              onClick={() => updateQuantity(p._id, "dec")}
                              className="px-2 text-lg"
                            >
                              -
                            </button>

                            <span>{cartItem.quantity}</span>

                            <button
                              onClick={() => updateQuantity(p._id, "inc")}
                              className="px-2 text-lg"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdd(p)}
                            className="bg-gray-200 px-3 py-1.5 rounded-lg"
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

          {/* LOAD MORE */}
          {products.length < totalCount && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-yellow-400 px-6 py-2 rounded-lg"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
