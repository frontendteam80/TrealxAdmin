 import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function isTokenValid(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const expiryTime = decodedPayload.exp * 1000;
    return expiryTime > Date.now();
  } catch (e) {
    return false;
  }
}

const ProtectedRoute = ({ children }) => {
  const { bearerToken, loading } = useAuth();

  if (loading) {
    // Optionally, return a loading spinner here
    return null;
  }

  if (!bearerToken || !isTokenValid(bearerToken)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
