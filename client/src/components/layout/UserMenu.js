import { NavLink } from "react-router-dom";
import { MdArrowRight } from "react-icons/md";

const UserMenu = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border-2 border-indigo-500">
      <h4 className="text-xl font-bold text-indigo-500 mb-4 text-center">
        Dashboard
      </h4>

      <div className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition font-semibold ${
              isActive
                ? "bg-indigo-500 text-white"
                : "text-gray-700  hover:bg-indigo-300 hover:text-white"
            }`
          }
        >
          <MdArrowRight size={25} /> Profile
        </NavLink>

        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg transition font-semibold ${
              isActive
                ? "bg-indigo-500 text-white"
                : "text-gray-700  hover:bg-indigo-300 hover:text-white"
            }`
          }
        >
          <MdArrowRight size={25} />
          Orders
        </NavLink>
      </div>
    </div>
  );
};

export default UserMenu;
