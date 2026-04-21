import React from "react";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 gap-8 grid md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-white mb-2"
          >
            <TiShoppingCart size={26} />
            E-Shopping
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your one-stop shop for all your needs. Quality products, best
            prices, and seamless shopping experience.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-md">
            <li>
              <Link to="/about" className="hover:text-indigo-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-indigo-400 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-md text-gray-400 leading-relaxed">
            📍 India <br />
            📧 support@eshopping.com <br />
            📞 +91 9876543210
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} PremSagar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
