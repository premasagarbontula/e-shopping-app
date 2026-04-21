import React from "react";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-gray-800">Loading...</h1>

      <div className="mt-6 w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
