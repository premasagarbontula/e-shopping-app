import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = useCallback(async () => {
    try {
      const { data } = await API.get("/product/get-products");
      setProducts(data?.products || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const productList = useMemo(() => products || [], [products]);

  return (
    <Layout title={"All Products"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-500">
            All Products List
          </h1>

          {productList.length === 0 ? (
            <div className="text-center text-gray-500">No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productList.map((p) => (
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  key={p._id}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
