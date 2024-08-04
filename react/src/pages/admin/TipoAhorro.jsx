/* eslint-disable react/prop-types */
import { CrudProvider } from "@/components/ContextCrud/Context";
import { ContextCrud } from "@/components/ContextCrud/ContextCrud";
import Layout from "@/layouts/navbar-sidebar";

const TipoAhorro = ({tipo=""}) => {
  return (
    <CrudProvider>
      <TipoAhorroContent tipo={tipo} />
    </CrudProvider>
  );
};

const TipoAhorroContent = ({tipo=""}) => {
  const formulario = {
    title: "Tipo de ahorro",
    addTxt: "Agregar tipo de ahorro",
    items: [
      {
        fieldName:"tipo_meta",
        label:"Tipo de meta",
        type: "select",
        ruta: "/finanza/TipoMeta",
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
    { header: "Tipo de meta", accessorKey: "nombre_tipo_meta" },
  ];

  return (
    <Layout title="Tipo de ahorro">
      <ContextCrud
        ruta="/finanza/TipoAhorro"
        formulario={formulario}
        baseColumns={baseColumns}
        getBy={[{op:tipo}]}
        showActionsColumn ={{ edit: true, delete: true }}
      />
    </Layout>
  );
};

export {TipoAhorro};
