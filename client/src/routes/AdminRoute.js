import { Outlet, Navigate } from "react-router-dom";

import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/authContext";

export default function AdminRoute() {
  const { auth } = useAuth();

  if (auth?.loading) {
    return <Spinner />;
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
