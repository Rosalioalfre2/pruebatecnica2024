/* eslint-disable react/prop-types */
import { routesItems } from "@/libs/rutas";
import Role from "@/components/Role";
import { Routes, Route } from "react-router";

const GenerateRoute = ({
  path,
  roles = [],
  child,
  items,
}) => {
  if (child == undefined) {
    return <></>;
  }
  return (
    <Routes>
      {roles.length == 0 && child != undefined ? (
        <Route path={`/${path}`} element={child} />
      ) : (
        <Route path={`/${path}`} element={<Role roles={roles}>{child}</Role>} />
      )}
      {items != undefined &&
        items
          .filter((item) => item.children != undefined)
          .map((item, index) => (
            <Route
              path={`/${path}/${item.to}`}
              element={<Role roles={roles ?? []}>{item.children}</Role>}
              key={index}
            />
          ))}
    </Routes>
  );
};

const GenerateRoutes = ({
  identifier,
  roles = [],
  items,
}) => {
  return (
    <Routes>
      <Route
        path={`/${identifier}/*`}
        element={
          <Role roles={roles}>
            {items &&
              items.length &&
              items.map((item, index) => (
                <GenerateRoute
                  path={item.to}
                  roles={item.roles}
                  child={item.children}
                  items={item.items}
                  key={index}
                />
              ))}
          </Role>
        }
      />
    </Routes>
  );
};

const Router = () => {
  return (
    <>
      {routesItems.map((item, index) => (
        <GenerateRoutes
          identifier={item.identifier}
          roles={item.roles}
          items={item.items}
          key={index}
        />
      ))}
    </>
  );
};

export { Router };
