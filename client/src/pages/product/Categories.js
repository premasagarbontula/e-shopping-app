import { Link } from "react-router-dom";
import { useMemo } from "react";

import Layout from "../../components/layout/Layout";
import useCategory from "../../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();

  const categoryList = useMemo(() => categories || [], [categories]);

  return (
    <Layout title={"All Categories"}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          All Categories
        </h1>

        {categoryList.length === 0 ? (
          <div className="text-center text-gray-500">
            No categories available
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categoryList.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="bg-indigo-600 text-white text-center py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
