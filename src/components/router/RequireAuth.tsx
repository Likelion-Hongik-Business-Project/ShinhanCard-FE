import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";

const RequireAuth = () => {
  const isLogin = useAuthStore(state => state.isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
