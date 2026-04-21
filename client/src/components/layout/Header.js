import { useState, useCallback } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import toast from "react-hot-toast";

import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/cartContext";
import SearchInput from "../form/SearchInput";
import useCategory from "../../hooks/useCategory";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const { auth, setAuth } = useAuth();
  const categories = useCategory();
  const navigate = useNavigate();
  const location = useLocation();

  const { cart } = useCart();
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  const hideSearchRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/about",
    "/contact",
    "/policy",
    "/cart",
  ];
  const shouldShowSearch = !hideSearchRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const handleLogout = useCallback(() => {
    setAuth((prev) => ({ ...prev, user: null, token: "" }));
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
    toast.success("Logged Out Successfully");
  }, [setAuth, navigate]);

  return (
    <header className="bg-gradient-to-r from-red-900 via-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <TiShoppingCart size={35} />
          E-Shopping
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {shouldShowSearch && <SearchInput />}

          <NavLink
            to="/"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "border-b-2 border-indigo-400"
                  : "hover:text-indigo-300"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "border-b-2 border-indigo-400"
                  : "hover:text-indigo-300"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "border-b-2 border-indigo-400"
                  : "hover:text-indigo-300"
              }`
            }
          >
            Contact
          </NavLink>

          {/* Categories */}
          <div className="relative">
            <button
              onClick={() => {
                setCatOpen((prev) => !prev);
                setUserOpen(false);
              }}
              className="hover:text-indigo-300"
            >
              Categories▾
            </button>

            {catOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-40" //Covers entire screen at z-40 level
                  onClick={() => setCatOpen(false)}
                />
                {/* Category Menu */}
                <div className="absolute left-0 bg-indigo-800 shadow-lg rounded-lg mt-2 w-48 p-2 z-50">
                  <Link
                    to="/categories"
                    className="block px-3 py-2 hover:bg-white hover:text-indigo-800 rounded"
                  >
                    All Categories
                  </Link>

                  {categories?.map((c) => (
                    <Link
                      key={c._id}
                      to={`/category/${c.slug}`}
                      className="block px-3 py-2 hover:bg-white hover:text-indigo-800 rounded"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Auth */}
          {!auth?.user ? (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `pb-1 ${
                    isActive
                      ? "border-b-2 border-indigo-400"
                      : "hover:text-indigo-300"
                  }`
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `pb-1 ${
                    isActive
                      ? "border-b-2 border-indigo-400"
                      : "hover:text-indigo-300"
                  }`
                }
              >
                Login
              </NavLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setUserOpen((prev) => !prev);
                  setCatOpen(false);
                }}
                className="hover:text-indigo-300"
              >
                {auth.user.name}▾
              </button>

              {userOpen && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 z-40" //Covers entire screen at z-40 level
                    onClick={() => setUserOpen(false)}
                  />
                  {/* User Menu */}
                  <div className="absolute left-0 bg-indigo-800 shadow-lg rounded-lg mt-2 w-44 p-2 z-50">
                    <NavLink
                      to={`/dashboard/user`}
                      className={({ isActive }) =>
                        `block px-3 py-2 hover:bg-white hover:text-indigo-800 rounded  ${isActive ? "no-underline" : ""}`
                      }
                    >
                      My Dashboard
                    </NavLink>
                    {auth?.user?.role === "admin" && (
                      <NavLink
                        to={`/dashboard/admin`}
                        className={({ isActive }) =>
                          `block px-3 py-2 hover:bg-white hover:text-indigo-800 rounded  ${isActive ? "no-underline" : ""}`
                        }
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-600 hover:text-white rounded"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Cart */}
          <NavLink to="/cart" className="relative">
            <TiShoppingCart size={26} />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-1.5 rounded-full">
              {totalQty}
            </span>
          </NavLink>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white text-black shadow">
          <SearchInput />

          <NavLink to="/" className="block">
            Home
          </NavLink>
          <NavLink to="/about" className="block">
            About
          </NavLink>
          <NavLink to="/contact" className="block">
            Contact
          </NavLink>

          <Link to="/categories" className="block">
            Categories
          </Link>

          {!auth?.user ? (
            <>
              <NavLink to="/register" className="block">
                Register
              </NavLink>
              <NavLink to="/login" className="block">
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`/dashboard/${auth.user.role === "admin" ? "admin" : "user"}`}
                className="block"
              >
                Dashboard
              </NavLink>

              <button onClick={handleLogout} className="block text-left w-full">
                Logout
              </button>
            </>
          )}

          <NavLink to="/cart" className="block">
            Cart ({cart?.length})
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
