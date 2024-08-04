import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useAuth } from "@/context/AuthContext";
import { Cuentas } from "./cuenta/Cuentas";

const DashboardPage = function () {
  const { userData } = useAuth();
  return (
    <NavbarSidebarLayout title={`Bienvenido ${userData.user ?? ""}`}>
      <Cuentas />
    </NavbarSidebarLayout>
  );
};

export default DashboardPage;
