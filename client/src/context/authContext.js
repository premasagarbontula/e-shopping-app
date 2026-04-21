import { useState, useContext, createContext, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/user-auth");

        if (isMounted) {
          setAuth({
            user: res.data.ok ? res.data.user : null,
            loading: false,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
        if (isMounted) {
          setAuth({ user: null, loading: false });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false; //Prevents state update after unmount and prevent memory leaks
    };
  }, []);

  // if not used useMemo, value is a new object every time
  // all consumers re-render unnecessarily
  const value = useMemo(() => ({ auth, setAuth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
