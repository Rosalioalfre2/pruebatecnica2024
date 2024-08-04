/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CrudContext = createContext(undefined);

export const CrudProvider = ({ children }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    unregister,
    setError,
    clearErrors,
  } = useForm();
  const [modal, setModal] = useState(false);
  const [filtro, setFiltros] = useState("");

  const [openViewer, setOpenViewer] = useState(false);
  const [dataViewer, setDataViewer] = useState({});
  const [objects, setObjects] = useState([]);
  const [reload, setReload] = useState(0);
  const [change, setChange] = useState(false);
  const [lengthPagination, setLengthPagination] = useState([
    10, 25, 50, 75, 100,
  ]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    items: lengthPagination[0],
  });
  const [alerta, setAlerta] = useState({ errors: [], warnings: [] });
  const [loadingForm, setLoadingForm] = useState(false);

  const toggleReload = () => {
    setReload(reload + 1);
  };

  const registerChange = () => {
    setChange(!change);
  };

  const contextValue = {
    handleSubmit,
    register,
    errors,
    setValue,
    reset,
    watch,
    unregister,
    setError,
    modal,
    setModal,
    filtro,
    setFiltros,
    pagination,
    setPagination,
    openViewer,
    setOpenViewer,
    dataViewer,
    setDataViewer,
    objects,
    setObjects,
    reload,
    setReload,
    toggleReload,
    lengthPagination,
    setLengthPagination,
    clearErrors,
    alerta,
    setAlerta,
    change,
    setChange,
    registerChange,
    loadingForm,
    setLoadingForm,
  };

  useEffect(() => {
    setPagination({ ...pagination, items: lengthPagination[0] });
  }, [lengthPagination]);

  return (
    <CrudContext.Provider value={contextValue}>{children}</CrudContext.Provider>
  );
};

export const useCrud = () => {
  const context = useContext(CrudContext);
  if (!context) {
    throw new Error("useCrud debe ser utilizado dentro de CrudProvider");
  }
  return context;
};
