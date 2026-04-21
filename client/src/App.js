import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import About from "./pages/info/About";
import Contact from "./pages/info/Contact";
import Policy from "./pages/info/Policy";
import Pagenotfound from "./pages/misc/PageNotFound";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import Users from "./pages/admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/admin/Products";
import UpdateProduct from "./pages/admin/UpdateProduct";
import SearchResults from "./pages/product/SearchResults";
import ProductDetails from "./pages/product/ProductDetails";
import Categories from "./pages/product/Categories";
import CategoryProduct from "./pages/product/CategoryProduct";
import CartWithStripe from "./pages/cart/CartWithStripe";
import AdminOrders from "./pages/admin/AdminOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/product/:slug",
    element: <ProductDetails />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/cart",
    element: <CartWithStripe />,
  },
  {
    path: "/category/:slug",
    element: <CategoryProduct />,
  },
  {
    path: "/search",
    element: <SearchResults />,
  },

  // User and Admin Routes
  {
    path: "/dashboard",
    children: [
      {
        element: <PrivateRoute />,
        children: [
          { path: "user", element: <Dashboard /> },
          { path: "user/orders", element: <Orders /> },
          { path: "user/profile", element: <Profile /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
          { path: "admin/create-category", element: <CreateCategory /> },
          { path: "admin/create-product", element: <CreateProduct /> },
          { path: "admin/product/:slug", element: <UpdateProduct /> },
          { path: "admin/products", element: <Products /> },
          { path: "admin/users", element: <Users /> },
          { path: "admin/orders", element: <AdminOrders /> },
        ],
      },
    ],
  },

  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/policy",
    element: <Policy />,
  },

  {
    path: "*",
    element: <Pagenotfound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
