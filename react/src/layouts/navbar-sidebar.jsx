/* eslint-disable react/prop-types */
import { Footer, Alert } from "flowbite-react";
import { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { useMediaQuery } from "@/hooks/Index";
import clsx from "clsx";
import { routesItems } from "@/libs/rutas";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";

const NavbarSidebarLayout=
  function ({ children, title = "", isFooter = true }) {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);
    const { alert, setAlert } = useAlert();

    function toogleSidebar() {
      setIsOpenSidebar(!isOpenSidebar);
    }

    const md = useMediaQuery("(max-width: 768px)");

    const { userData } = useAuth();

    const tienePermisos = (rolesRuta, rolesUsuario) => {
      if (rolesRuta == undefined || !rolesRuta || rolesRuta.length === 0) {
        return true;
      }
      if (
        rolesUsuario == undefined ||
        !rolesUsuario ||
        rolesUsuario.length === 0
      ) {
        return true;
      }

      return rolesUsuario.some((rolUsuario) =>
        rolesRuta.includes(rolUsuario.name),
      );
    };

    const rutasFiltradas = routesItems
      .filter(
        (ruta) =>
          ruta.navbar !== false && tienePermisos(ruta.roles, userData.groups),
      )
      .map((ruta) => ({
        ...ruta,
        items: ruta.items
          .filter(
            (subruta) =>
              subruta.navbar !== false &&
              tienePermisos(subruta.roles, userData.groups),
          )
          .map((subruta) => ({
            ...subruta,
          })),
      }));

    return (
      <div className="min-h-screen">
        <div className="text-white">
          <Navbar toogleSidebar={toogleSidebar} items={rutasFiltradas} />
        </div>
        <div className="flex items-start pl-2 pt-4">
          <MainContent isFooter={isFooter}>
            <div
              className={clsx(
                `rounded-lg bg-gradient-to-br from-stone-200 via-slate-300 to-stone-200 p-2 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 md:p-4 min-h-[80vh]`,
                md ? "mr-2" : "",
              )}
            >
              <div>
                {alert.errors.length > 0 ? (
                  <Alert
                    color={"failure"}
                    className="my-2"
                    onDismiss={() => setAlert({ ...alert, errors: [] })}
                  >
                    <div className="flex flex-col font-bold">
                      {alert.errors.map((error, index) => (
                        <span key={index}>ꔷ {error}</span>
                      ))}
                    </div>
                  </Alert>
                ) : null}
                {alert.warnings.length > 0 ? (
                  <Alert
                    color={"warning"}
                    className="my-2"
                    onDismiss={() => setAlert({ ...alert, warnings: [] })}
                  >
                    <div className="flex flex-col font-bold">
                      {alert.warnings.map((warning, index) => (
                        <span key={index}>ꔷ {warning}</span>
                      ))}
                    </div>
                  </Alert>
                ) : null}
              </div>
              <h1 className="mb-4 text-3xl font-semibold text-black dark:text-white">
                {title}
              </h1>
              <div>{children}</div>
            </div>
          </MainContent>
          <div className="dark">
            {/* <div className="dark h-[85vh] overflow-y-auto"> */}
            <Sidebar
              isOpenSidebar={isOpenSidebar}
              items={routesItems
                .map((item) => {
                  if (item.navbar === false) {
                    return null;
                  }

                  const modifiedItems = item.items
                    .filter(
                      (subItem) =>
                        subItem.navbar !== false &&
                        tienePermisos(subItem.roles, userData.groups),
                    )
                    .map((subItem) => ({
                      ...subItem,
                      to: `/${item.identifier}/${subItem.to}`,
                    }));
                  return modifiedItems;
                })
                .filter(Boolean)}
            />
          </div>
        </div>
      </div>
    );
  };

const MainContent = function ({
  children,
  isFooter,
}) {
  return (
    <main className="relative size-full overflow-y-auto bg-gray-50 dark:bg-gray-900 lg:mr-4">
      {children}
      {isFooter && (
        <div className="mt-2">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter= function () {
  const year = new Date().getFullYear();
  return (
    <>
      <Footer container className="bg-slate-800">
        <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
          <Footer.LinkGroup className="text-white">
            <Footer.Link href="#" className="mb-3 mr-3 lg:mb-0">
              &copy; 2024 - {year} - Rosalio Monterrosa
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
      </Footer>
    </>
  );
};

export default NavbarSidebarLayout;
