/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NoPrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();

  return isAuth ? <Navigate to="/" /> : children;
};

export default NoPrivateRoute;
