/* eslint-disable react/prop-types */
import Layout from "@/layouts/navbar-sidebar";
import { CrudProvider } from "@/components/ContextCrud/Context";
import { ContextCrud } from "@/components/ContextCrud/ContextCrud";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { NavTabs } from "@/components/ui/Index";
import { GiPayMoney } from "react-icons/gi";

const TabTipoMovimiento = ({tipo}) => {
  const tabsItems = [
    {
      title: "Ingresos",
      icon: FaMoneyBillTrendUp,
      children: <TipoMovimiento tipo={tipo} origen={1} />,
    },
    {
      title: "Gastos",
      icon: GiPayMoney,
      children: <TipoMovimiento tipo={tipo} origen={2} />,
    },
  ];

  return (
    <>
      <Layout title="Registrar tipo de ingresos o gastos">
        <div className="flex flex-col">
          <div>
            <NavTabs items={tabsItems} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export {TabTipoMovimiento};

const TipoMovimiento = ({tipo="", origen=1}) => {
  return (
    <CrudProvider>
      <TipoMovimientoContent tipo={tipo} origen={origen} />
    </CrudProvider>
  );
};

const TipoMovimientoContent = ({tipo="",origen=1}) => {
  const formulario = {
    title: "Registrar tipo movimiento",
    addTxt: "Agregar tipo de movimiento",
    items: [
      {
        fieldName: "nombre",
        label: "Nombre",
        type: "name",
        required: true,
      },
      {
        fieldName: "op",
        value: tipo,
        type: "hidden"
      },
      {
        fieldName: "origen",
        value: origen,
        type: "hidden"
      }
    ],
  };

  const baseColumns = [
    { header: "Nombre", accessorKey: "nombre" },
  ];

  return (
      <ContextCrud
        ruta="/finanza/TipoMovimiento"
        formulario={formulario}
        baseColumns={baseColumns}
        getBy={[{op:tipo},{origen}]}
        showActionsColumn ={{ edit: true, delete: true }}
      />
  );
};

export {TipoMovimiento};
