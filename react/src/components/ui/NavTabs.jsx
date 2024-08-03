/* eslint-disable react/prop-types */
import { useState } from "react";
import { Tabs } from "flowbite-react";
import { useAuth } from "@/context/AuthContext";

const NavTabs = ({
  items,
}) => {
  const [index, setIndex] = useState([0]);
  const { userData } = useAuth();
  return (
    <Tabs
      aria-label="Tabs with icons"
      style="fullWidth"
      onActiveTabChange={(indice) => setIndex([...index, indice])}
    >
      {items
        .map(
          (
            item
          ) => {
            if (item == null) {
              return null;
            }
            if (typeof item == "object" && item.roles == undefined) {
              return item;
            }

            let devolucion = item.roles.map((role) => {
              if (
                userData?.groups &&
                userData?.groups.map((group) => group.name).includes(role)
              ) {
                return item;
              } else {
                return null;
              }
            });

            devolucion = devolucion.filter((item) => item != null);
            if (devolucion.length == 0) {
              return null;
            } else {
              return devolucion[0];
            }
          },
        )
        .filter((item) => item != null)
        .map((item, key) => (
          <Tabs.Item key={key} title={item.title ?? ""} icon={item.icon ?? ""}>
            {index.includes(key) && item.children}
          </Tabs.Item>
        ))}
    </Tabs>
  );
};

export { NavTabs };
