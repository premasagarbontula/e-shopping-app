import { Link } from "react-router-dom";

const EmptyCartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 mt-2 text-center">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
        alt="cart empty"
        className="w-64 md:w-80 mb-6"
      />

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        Your Cart Is Empty
      </h1>

      <p className="text-gray-500 mt-2">
        Looks like you haven’t added anything yet
      </p>

      <Link
        to="/"
        className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Shop Now
      </Link>
    </div>
  );
};

export default EmptyCartPage;
