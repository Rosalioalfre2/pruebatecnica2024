import { CrudProvider } from "@/components/ContextCrud/Context";
import { ContextCrud } from "@/components/ContextCrud/ContextCrud";
import Layout from "@/layouts/navbar-sidebar";

const OrigenMovimiento = () => {
  return (
    <CrudProvider>
      <OrigenMovimientoContent />
    </CrudProvider>
  );
};

const OrigenMovimientoContent = () => {
  const formulario = {
    title: "Origen movimiento",
    addTxt: "Agregar origen movimiento",
    items: [
      {
        fieldName: "nombre",
        label: "Nombre del tipo de meta",
        type: "name",
        required: true,
      },
    ],
  };

  const baseColumns = [
    { header: "Id", accessorKey: "id" },
    { header: "Nombre", accessorKey: "nombre" },
  ];

  return (
    <Layout title="Origen movimiento">
      <ContextCrud
        ruta="/finanza/OrigenMovimiento"
        formulario={formulario}
        baseColumns={baseColumns}
        showActionsColumn ={false}
        showAddButton={false}
      />
    </Layout>
  );
};

export {OrigenMovimiento};
