import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const AdminPrivateRoute = () => {
  const { user } = useContext(AuthContext);

  const isAdmin = user.role === "admin";
 
  return isAdmin ? <Outlet/> : <Navigate to="/" replace />;
};

export default AdminPrivateRoute;
