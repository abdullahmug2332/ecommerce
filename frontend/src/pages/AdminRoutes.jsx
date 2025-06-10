import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie'; // ✅ Import this

export default function AdminRoutes() {
  const authRole = Cookies.get("role");
  return authRole === JSON.stringify("admin") ? <Outlet /> : <Navigate to="/" />;
}
