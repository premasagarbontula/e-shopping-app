import React, { useCallback } from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  const onChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter category name"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition mr-4"
      >
        Submit
      </button>
    </form>
  );
};

export default CategoryForm;
