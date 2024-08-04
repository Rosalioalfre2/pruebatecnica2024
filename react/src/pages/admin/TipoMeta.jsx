import { CrudProvider } from "@/components/ContextCrud/Context";
import { ContextCrud } from "@/components/ContextCrud/ContextCrud";
import Layout from "@/layouts/navbar-sidebar";

const TipoMeta = () => {
  return (
    <CrudProvider>
      <TipoMetaContent />
    </CrudProvider>
  );
};

const TipoMetaContent = () => {
  const formulario = {
    title: "Tipo de meta",
    addTxt: "Agregar tipo de meta",
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
    { header: "Nombre", accessorKey: "nombre" },
  ];

  return (
    <Layout title="Tipo de meta">
      <ContextCrud
        ruta="/finanza/TipoMeta"
        formulario={formulario}
        baseColumns={baseColumns}
      />
    </Layout>
  );
};

export {TipoMeta};
