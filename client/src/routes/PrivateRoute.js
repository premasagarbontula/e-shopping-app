import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "../context/authContext";
import Spinner from "../components/common/Spinner";

export default function PrivateRoute() {
  const { auth } = useAuth();

  if (auth?.loading) {
    return <Spinner />;
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
