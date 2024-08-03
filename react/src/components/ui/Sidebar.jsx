/* eslint-disable react/prop-types */
import { Sidebar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Fragment } from "react";
import { HiLogin, HiPencil } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { FaAngleLeft } from "react-icons/fa6";

const SidebarComponent = ({
  sidebarItems,
}) => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const noLogin = [
    {
      to: "/authentication/sign-in",
      icon: HiLogin,
      className: "",
      label: "Inicio de sesión",
    },
    {
      to: "/authentication/sign-up",
      icon: HiPencil,
      className: "",
      label: "Registro",
    },
  ];

  return (
    <>
      <>
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={FaAngleLeft} onClick={() => navigate(-1)}>
            Regresar
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </>
      <Fragment>
        {!isAuth && (
          <Sidebar.ItemGroup>
            <>
              {noLogin.map((item, index) => (
                <Sidebar.Item
                  key={index}
                  icon={item.icon ?? ""}
                  as={Link}
                  to={item.to ?? "#"}
                  className={clsx(
                    `${
                      location.pathname == item.to
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`,
                    item.className,
                  )}
                >
                  {item.label}
                </Sidebar.Item>
              ))}
            </>
          </Sidebar.ItemGroup>
        )}
      </Fragment>
      {sidebarItems.map((sidebarItem, index) => (
        <Fragment key={index}>
          {sidebarItem.length > 0 && (
            <>
              {sidebarItem.length > 0 &&
                sidebarItem.some((item) => location.pathname == item.to) && (
                  <Sidebar.ItemGroup key={index}>
                    {sidebarItem
                      .filter((item) => {
                        if (
                          // item.empresa == undefined ||
                          // item.empresa.includes(empresa.id)
                          item
                        ) {
                          return item;
                        }
                      })
                      .map((item, index) => (
                        <Sidebar.Item
                          key={index}
                          icon={item.icon ?? ""}
                          as={Link}
                          to={item.to ?? "#"}
                          className={clsx(
                            `${
                              location.pathname == item.to
                                ? "bg-gray-100 dark:bg-gray-700"
                                : ""
                            }`,
                            item.className,
                          )}
                        >
                          {item.label}
                        </Sidebar.Item>
                      ))}
                  </Sidebar.ItemGroup>
                )}
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

export { SidebarComponent };
