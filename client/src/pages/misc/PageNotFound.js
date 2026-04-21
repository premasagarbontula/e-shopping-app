import React from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/layout/Layout";

const Pagenotfound = () => {
  return (
    <Layout title={"Go to Home Page"}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-7xl md:text-9xl font-extrabold text-gray-800">
          404
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-500 mt-4">
          Oops! Page Not Found
        </h2>

        <Link
          to="/"
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
