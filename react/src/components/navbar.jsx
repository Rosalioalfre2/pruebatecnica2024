/* eslint-disable react/prop-types */
import {
  Button,
  DarkThemeToggle,
  Navbar,
  Avatar,
  Dropdown,
} from "flowbite-react";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  DropdownComponent,
  NavlinkItems,
  RCollabsible,
} from "@/components/ui/Index";
import { useAuth } from "@/context/AuthContext";

const ExampleNavbar = ({
  toogleSidebar,
  items = [],
}) => {
  const navlinkItems = [
    {
      to: "/",
      label: "Inicio",
    },
  ];

  const { isAuth, userData, logout } = useAuth();

  return (
    <Navbar
      className="rounded-b-xl bg-blue-800"
      fluid
    >
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center">
            <Navbar.Brand className="block" href="/">
              <img
                alt="prueba tecnica"
                src={'/images/enterprise/local.png'}
                className="mr-3 h-10 min-w-fit sm:h-10"
              />
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto dark:text-white">
            <RCollabsible>
              {items
                .filter((item) => {
                  let doesItExist = false;
                  let rolePermission = false;

                  item.items.map((item) => {
                    if (
                      // item.empresa == undefined ||
                      // item.empresa.includes(empresa.id)
                      item 
                    ) {
                      doesItExist = true;
                    }
                  });

                  if (item.roles && item.roles.length > 0) {
                    userData?.groups?.map((group) => {
                      if (item.roles.includes(group.name)) {
                        rolePermission = true;
                      }
                    });
                  } else if (item.roles == undefined) {
                    rolePermission = true;
                  }

                  if (doesItExist && rolePermission && item.navbar != false) {
                    return item;
                  }
                })
                .map((item, index) => (
                  <DropdownComponent
                    key={index}
                    label={item.label}
                    items={item.items}
                    icon={item.icon ?? ""}
                    identifier={item.identifier ?? ""}
                  ></DropdownComponent>
                ))}
              <NavlinkItems items={navlinkItems} />
              <DarkThemeToggle className="rounded-xl bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-200" />
            </RCollabsible>
            {isAuth && (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="Foto del usuario"
                    // img={
                    //   userData?.url_foto != "" || userData?.url_foto != null
                    //     ? `${ruta}/files/${userData?.url_foto}`
                    //     : "/images/users/profile_example.jpg"
                    // }
                    img={ "/images/users/user.jpg"}
                    rounded
                    className="aspect-square min-w-fit"
                  />
                }
              >
                <Dropdown.Header>
                  <span className="mb-2 block text-sm">{userData?.user}</span>
                  <span className="mb-1 block truncate text-sm font-medium">
                    {userData?.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>Cerrar sesión</Dropdown.Item>
              </Dropdown>
            )}
            <Button color="dark" onClick={toogleSidebar}>
              <HiMenuAlt3 />
            </Button>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
