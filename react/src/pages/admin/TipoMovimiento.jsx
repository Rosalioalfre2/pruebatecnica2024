/* eslint-disable react/prop-types */
import { CrudProvider } from "@/components/ContextCrud/Context";
import { ContextCrud } from "@/components/ContextCrud/ContextCrud";
import Layout from "@/layouts/navbar-sidebar";

const TipoMovimiento = ({tipo=""}) => {
  return (
    <CrudProvider>
      <TipoMovimientoContent tipo={tipo} />
    </CrudProvider>
  );
};

const TipoMovimientoContent = ({tipo=""}) => {
  const formulario = {
    title: "Tipo de movimiento",
    addTxt: "Agregar tipo de movimiento",
    items: [
      {
        fieldName:"origen",
        label:"Origen",
        type: "select",
        ruta: "/finanza/OrigenMovimiento",
        validation: {
          required: true,
        },
      },
      {
        fieldName: "nombre",
        label: "Nombre del tipo de ahorro",
        type: "name",
        required: true,
      },
      {
        fieldName: "op",
        value: tipo,
        type: "hidden"
      }
    ],
  };

  const baseColumns = [
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Origen", accessorKey: "nombre_origen" },
  ];

  return (
    <Layout title="Tipo de movimiento">
      <ContextCrud
        ruta="/finanza/TipoMovimiento"
        formulario={formulario}
        baseColumns={baseColumns}
        getBy={[{op:tipo}]}
        showActionsColumn ={{ edit: true, delete: true }}
      />
    </Layout>
  );
};

export {TipoMovimiento};
