import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import { useCart } from "../../context/cartContext";
import API from "../../api/axios";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCartItem = (id) => cart.find((item) => item._id === id);

  const handleAdd = (product) => {
    if (product.quantity === 0) {
      return toast.error("Out of stock");
    }
    addToCart(product);
    toast.success(`${product.name} is added to cart`);
  };

  // Fetch similar products
  const getSimilarProducts = useCallback(async (pid, cid) => {
    try {
      const { data } = await API.get(`/product/similar-products/${pid}/${cid}`);
      setSimilarProducts(data?.products || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  // Fetch single product
  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/product/get-product/${params.slug}`);

      const prod = data?.product || {};
      setProduct(prod);

      if (prod?._id && prod?.category?._id) {
        getSimilarProducts(prod._id, prod.category._id);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }, [params.slug, getSimilarProducts]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug, getProduct]);

  const cartItem = getCartItem(product._id);

  return (
    <Layout title={product?.name}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img
                src={product?.image}
                alt={product?.name}
                className="w-full h-[400px] object-cover rounded-2xl shadow-md"
              />

              <div>
                <h1 className="text-3xl font-bold">{product?.name}</h1>

                <p className="text-2xl text-indigo-600 mt-2">
                  ₹ {product?.price}
                </p>

                <p className="mt-4 text-gray-600">{product?.description}</p>
                <p className="mt-4 font-semibold text-gray-600">
                  Brand :{" "}
                  <span className="text-indigo-600">{product?.brand}</span>
                </p>

                <div className="mt-6">
                  {product?.quantity === 0 ? (
                    <span className="text-red-500 font-semibold">
                      Out of Stock
                    </span>
                  ) : cartItem ? (
                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg w-fit">
                      <button
                        onClick={() => updateQuantity(product._id, "dec")}
                        className="px-3 text-lg font-bold"
                      >
                        -
                      </button>

                      <span className="min-w-[20px] text-center">
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(product._id, "inc")}
                        className="px-3 text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(product)}
                      className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                    >
                      Add To Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ================= SIMILAR PRODUCTS ================= */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Similar Products</h2>

              {similarProducts.length === 0 ? (
                <p className="text-center text-red-500">
                  No Similar Products Found
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {similarProducts.map((p) => {
                    const cartItem = getCartItem(p._id);

                    return (
                      <div
                        key={p._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-3">
                          <h3 className="text-sm font-semibold">{p.name}</h3>

                          <p className="text-indigo-600 font-bold">
                            ₹ {p.price}
                          </p>

                          <div className="mt-3 flex gap-2 items-center">
                            <button
                              onClick={() => navigate(`/product/${p.slug}`)}
                              className="flex-1 bg-indigo-600 text-white py-1 rounded"
                            >
                              Details
                            </button>

                            {p.quantity === 0 ? (
                              <span className="text-red-500 text-sm">
                                Out of Stock
                              </span>
                            ) : cartItem ? (
                              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                <button
                                  onClick={() => updateQuantity(p._id, "dec")}
                                >
                                  -
                                </button>

                                <span>{cartItem.quantity}</span>

                                <button
                                  onClick={() => updateQuantity(p._id, "inc")}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAdd(p)}
                                className="bg-gray-200 px-2 py-1 rounded"
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
