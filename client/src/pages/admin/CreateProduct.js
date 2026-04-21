import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Select } from "antd";

import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import API from "../../api/axios";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    brand: "",
    image: "",
    rating: "",
    reviews: "",
    category: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await API.get("/category/get-category");
      if (data?.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  }, []);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const productData = {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity),
          brand: form.brand.trim(),
          image: form.image.trim(),
          category: form.category,
          rating: Number(form.rating),
          reviews: Number(form.reviews),
        };

        const { data } = await API.post("/product/create-product", productData);

        if (data?.success) {
          toast.success("Product Created Successfully");
          navigate("/dashboard/admin/products");
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [form, navigate],
  );

  return (
    <Layout title={"Create Product"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-xl">
            <h1 className="text-2xl font-bold mb-4 text-indigo-500">
              Create Product
            </h1>

            <form onSubmit={handleCreate} className="space-y-4">
              <Select
                placeholder="Select Category"
                size="large"
                showSearch
                className="w-full"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, category: value }))
                }
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                name="reviews"
                value={form.reviews}
                onChange={handleChange}
                placeholder="Reviews"
                className="w-full border rounded-lg px-4 py-2"
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
