import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/authContext";

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <UserMenu />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md border-2 border-indigo-500">
            <h2 className="text-xl font-bold text-indigo-500 mb-4">
              User Details
            </h2>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Name:</span> {auth?.user?.name}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> {auth?.user?.email}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              {auth?.user?.address}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
