import React from "react";

import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { useAuth } from "../../context/authContext";

const AdminDashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title={"Admin Dashboard"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md border-2 border-indigo-500">
            <h2 className="text-xl font-bold  mb-4 text-indigo-500">
              Admin Details
            </h2>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Name:</span> {auth?.user?.name}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> {auth?.user?.email}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span>{" "}
              {auth?.user?.phone}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
