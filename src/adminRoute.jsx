import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

export default function AdminRoutes() {
  const { user } = useContext(AuthContext);

  return user && user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" replace />
  );
}