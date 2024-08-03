/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Dropdown, Modal, Accordion } from "flowbite-react";
import { HiMenuAlt2 } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const NavlinkItems= ({ items }) => {
  const location = useLocation();
  return (
    <>
      {items.map((item, index) => (
        <Link
          to={item.to}
          key={index}
          className={clsx(
            `flex py-2 md:py-0 md:px-3 justify-center items-center hover:bg-gray-400 dark:hover:bg-gray-700 rounded-xl ${
              location.pathname == item.to
                ? "bg-gray-500 text-white dark:bg-gray-600"
                : ""
            }`,
            item.className,
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

const DropdownComponent = ({
  label,
  items,
  identifier,
  ...props
}) => {
  return (
    <NavbarDropdown label={label} {...props}>
      {items
        .filter((item) => {
          if (item) {
            return item;
          }

          return;
        })
        .map((item, index) => (
          <NavbarDropdownItem
            key={index}
            to={`/${identifier}/${item.to}`}
            {...props}
          >
            <div className="flex flex-row items-center">
              {item.icon && <item.icon className="mr-2" />} {item.label}
            </div>
          </NavbarDropdownItem>
        ))}
    </NavbarDropdown>
  );
};

const RCollabsible = ({ children, className }) => {
  const [toogle, setToogle] = useState(false);

  const changeToogle = () => {
    setToogle(!toogle);
  };

  return (
    <>
      <Button onClick={changeToogle} className="md:hidden" color="dark">
        <HiMenuAlt2 />
      </Button>
      <div
        className={clsx(
          `hidden md:flex md:flex-row md:w-auto gap-4`,
          className,
        )}
      >
        {children}
      </div>
      <Modal
        show={toogle}
        className={clsx("block md:hidden")}
        onClose={() => {
          setToogle(false);
        }}
        size="sm"
      >
        <Modal.Header>Prueba tecnica</Modal.Header>
        <Modal.Body className={clsx("dark:text-white flex flex-col gap-3")}>
          {children}
        </Modal.Body>
        <Modal.Footer className={clsx("dark:text-white")}>
          Prueba tecnica
        </Modal.Footer>
      </Modal>
    </>
  );
};

const NavbarDropdown = ({
  className,
  children,
  label,
  ...props
}) => {
  return (
    <>
      <div className="hidden md:flex">
        <Dropdown
          className={clsx(
            "md:flex md:flex-col dark:text-white md:w-auto",
            className,
          )}
          label={label}
          inline
          {...props}
        >
          {children}
        </Dropdown>
      </div>
      <Accordion className={clsx("md:hidden")} collapseAll>
        <Accordion.Panel>
          <Accordion.Title className="text-gray-900">{label}</Accordion.Title>
          <Accordion.Content className={clsx("py-2")}>
            <div className={clsx("flex flex-col dark:text-white m-0")}>
              {children}
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </>
  );
};

const NavbarDropdownItem = ({
  to,
  children,
  className,
  ...props
}) => {
  const location = useLocation();
  return (
    <>
      <Link
        className={clsx(
          `hover:bg-gray-300 dark:hover:bg-gray-600 md:flex md:flex-col md:w-auto m-1 py-1 px-2 rounded ${
            location.pathname == to ? "bg-gray-400 dark:bg-gray-500" : ""
          }`,
          className,
        )}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </>
  );
};

export { NavbarDropdown, NavlinkItems, DropdownComponent, RCollabsible };
