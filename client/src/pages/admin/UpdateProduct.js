import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Select } from "antd";

import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import API from "../../api/axios";

const { Option } = Select;

const UpdateProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
    category: "",
    brand: "",
    rating: "",
    reviews: "",
  });
  const [id, setId] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getSingleProduct = useCallback(async () => {
    try {
      const { data } = await API.get(`/product/get-product/${params.slug}`);
      const p = data?.product;

      if (p) {
        setId(p._id);
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          quantity: p.quantity || "",
          image: p.image || "",
          category: p.category?._id || "",
          brand: p.brand || "",
          rating: p.rating || "",
          reviews: p.reviews || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, [params.slug]);

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
    getSingleProduct();
    getAllCategory();
  }, [getSingleProduct, getAllCategory]);

  const handleUpdate = useCallback(
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

        const { data } = await API.put(
          `/product/update-product/${id}`,
          productData,
        );

        if (data?.success) {
          toast.success("Product Updated");
          navigate("/dashboard/admin/products");
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [form, id, navigate],
  );

  const handleDelete = useCallback(async () => {
    try {
      const confirm = window.confirm("Delete this product?");
      if (!confirm) return;

      const { data } = await API.delete(`/product/delete-product/${id}`);

      toast.success(data.message);
      navigate("/dashboard/admin/products");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }, [id, navigate]);

  return (
    <Layout title={"Update Product"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-indigo-500">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Update Product</h1>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Select
                placeholder="Select Category"
                size="large"
                showSearch
                className="w-full"
                value={form.category}
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
                Update Product
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Delete Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
