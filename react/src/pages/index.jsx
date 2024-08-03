import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = function () {
  const { userData } = useAuth();
  return (
    <NavbarSidebarLayout title={`Bienvenido ${userData.user ?? ""}`}>
      <h1>Prueba tecnica</h1>
    </NavbarSidebarLayout>
  );
};

export default DashboardPage;
