import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import validator from "validator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Layout from "../../components/layout/Layout";
import API from "../../api/axios";
import { useAuth } from "../../context/authContext";

const Register = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
  });

  const [show, setShow] = useState({
    password: false,
    answer: false,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleShow = useCallback((field) => {
    setShow((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const validateForm = useCallback(() => {
    const { name, email, password, phone, address, answer } = form;

    if (!name.trim() || name.length < 3) {
      toast.error("Valid name with atleast 3 characters is required");
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email");
      return false;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    const strongPassword = validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    });
    if (!strongPassword) {
      toast.error(
        "Password must include uppercase,lowercase,number and special character",
      );
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Invalid phone number");
      return false;
    }

    if (!address.trim()) {
      toast.error("Valid address required");
      return false;
    }
    if (address.length < 5) {
      toast.error("Address is too small");
      return false;
    }

    if (!answer.trim()) {
      toast.error("Security answer is required");
      return false;
    }

    return true;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        const { data } = await API.post("/auth/register", {
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          answer: form.answer.trim(),
        });

        if (data.success) {
          toast.success(data.message);
          navigate("/login");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    [form, navigate, validateForm],
  );
  useEffect(() => {
    if (auth?.user) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  return (
    <Layout title={"Register Now - Start Shopping"}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-4">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Create Account 🚀
          </h1>

          <p className="text-center text-gray-500 mb-6 text-sm">
            Join us and start your shopping journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              autoComplete="name"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />

            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500"
              />
              <span
                onClick={() => toggleShow("password")}
                className="absolute right-4 top-3 cursor-pointer"
              >
                {show.password ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              autoComplete="tel"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              autoComplete="street-address"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />

            <div className="relative">
              <input
                type={show.answer ? "text" : "password"}
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Security Answer"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-12 focus:ring-2 focus:ring-indigo-500"
              />
              <span
                onClick={() => toggleShow("answer")}
                className="absolute right-4 top-3 cursor-pointer"
              >
                {show.answer ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
