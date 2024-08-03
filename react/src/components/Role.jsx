/* eslint-disable react/prop-types */
import { useAuth } from "@/context/AuthContext";
import { Fragment } from "react";
import Unauthorized from "@/components/pages/Unauthorized";

const Role = ({
  roles,
  children,
  view = false,
}) => {
  const { userData } = useAuth();

  const hasRequiredRoles = roles.every((role) =>
    userData?.roles?.includes(role),
  );

  const hasRequiredGroups = roles.some((role) =>
    userData?.groups?.some((group) => group.name === role),
  );

  if (hasRequiredRoles || hasRequiredGroups) {
    return <Fragment>{children}</Fragment>;
  }

  return <>{view ? <Unauthorized /> : <></>}</>;
};

export default Role;
