import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import { useSearch } from "../../context/searchContext";
import { useCart } from "../../context/cartContext";

const SearchResults = () => {
  const { search } = useSearch();
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const results = useMemo(() => search?.results || [], [search?.results]);

  const handleNavigate = useCallback(
    (slug) => {
      navigate(`/product/${slug}`);
    },
    [navigate],
  );

  const handleAdd = (product) => {
    if (product.quantity === 0) {
      return toast.error("Out of stock");
    }
    addToCart(product);
    toast.success(`${product.name} is added to cart`);
  };

  const getCartItem = (id) => {
    return cart.find((item) => item._id === id);
  };

  return (
    <Layout title={"Search results"}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
          <p className="text-gray-500 mt-2">
            {results.length === 0
              ? "No Products Found"
              : `Products Found : ${results.length}`}
          </p>
        </div>

        {/* No Results */}
        {results.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No products match your search
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((p) => {
              const cartItem = getCartItem(p._id);

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
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
                        onClick={() => handleNavigate(p.slug)}
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
                          onClick={() => handleAdd(p)}
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

export default SearchResults;
