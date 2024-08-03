/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

const AlertContext = createContext(undefined);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    errors: [],
    warnings: [],
  });

  const cleanAlerts = () => {
    setAlert({
      errors: [],
      warnings: [],
    });
  };

  const contextValue = {
    alert,
    setAlert,
    cleanAlerts,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = ()=> {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe ser utilizado dentro de AlertProvider");
  }
  return context;
};
