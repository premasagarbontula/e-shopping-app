import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { useAuth } from "../../context/authContext";

export default function Login() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        setAuth((prev) => ({
          ...prev,
          user: data.user,
        }));
        navigate(location.state || "/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/", { replace: true }); //preventing users from navigating back
    }
  }, [auth, navigate]);

  return (
    <Layout title={"Login Now - Start Shopping"}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h1>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Login to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500"
                required
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="w-full text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
