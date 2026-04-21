import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import API from "../../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    answer: "",
    newPassword: "",
  });
  const [show, setShow] = useState({
    password: false,
    answer: false,
  });
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const { email, answer, newPassword } = form;

    if (!email.trim()) return toast.error("Email is required");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Invalid email");

    if (!answer.trim()) return toast.error("Security answer is required");

    if (!newPassword || newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        const { data } = await API.post("/auth/forgot-password", {
          email: form.email.trim().toLowerCase(),
          answer: form.answer.trim(),
          newPassword: form.newPassword.trim(),
        });

        if (data.success) {
          toast.success(data.message);
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [form, navigate, validateForm],
  );

  return (
    <Layout title={"Reset Your Password"}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="relative">
              <input
                type={show.answer ? "text" : "password"}
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Security Answer"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span
                onClick={() =>
                  setShow((prev) => ({ ...prev, answer: !show.answer }))
                }
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
              >
                {show.answer ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span
                onClick={() =>
                  setShow((prev) => ({ ...prev, password: !show.password }))
                }
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
              >
                {show.password ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
