// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if (!payload || !payload.username || (payload.exp && payload.exp < currentTime)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
