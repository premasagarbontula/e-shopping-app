import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Modal } from "antd";

import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import CategoryForm from "../../components/form/CategoryForm";
import API from "../../api/axios";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const getAllCategory = useCallback(async () => {
    try {
      const { data } = await API.get("/category/get-category");
      if (data?.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const { data } = await API.post("/category/create-category", {
          name: name.trim(),
        });

        if (data?.success) {
          toast.success(`${name} category created`);
          setName("");
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [name, getAllCategory],
  );

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const { data } = await API.put(
          `/category/update-category/${selected?._id}`,
          { name: updatedName.trim() },
        );

        if (data?.success) {
          toast.success(`${data.category?.name} category updated`);
          setSelected(null);
          setUpdatedName("");
          setVisible(false);
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [selected, updatedName, getAllCategory],
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        const confirm = window.confirm("Delete this category?");
        if (!confirm) return;

        const { data } = await API.delete(`/category/delete-category/${id}`);

        if (data?.success) {
          toast.success(`${data.category?.name} category deleted`);
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [getAllCategory],
  );

  return (
    <Layout title={"Manage Category"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-2 text-indigo-500">
            Create Category
          </h1>

          <div className="bg-white p-4 rounded-xl shadow-md max-w-md mb-6">
            <CategoryForm
              handleSubmit={handleSubmit}
              value={name}
              setValue={setName}
            />
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => {
                          setVisible(true);
                          setUpdatedName(c.name);
                          setSelected(c);
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleUpdate}
            />
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
