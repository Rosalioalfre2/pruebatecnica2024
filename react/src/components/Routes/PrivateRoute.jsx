/* eslint-disable react/prop-types */
// PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute = ({
  ruta = "",
  children,
}) => {
  const { isAuth } = useAuth();

  return isAuth ? (
    children
  ) : (
    <Navigate to={ruta != "" ? ruta : "/unauthorized"} />
  );
};

export default PrivateRoute;
