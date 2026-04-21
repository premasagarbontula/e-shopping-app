import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await API.get("/category/get-category");
        setCategories(data?.categories || []);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };

    getCategories();
  }, []);

  return categories;
}
