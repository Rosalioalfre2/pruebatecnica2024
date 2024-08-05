import { GiStairsGoal } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

// Rutas de admin
import {TipoMeta} from '@/pages/admin/TipoMeta'
import { TipoAhorro } from "@/pages/admin/TipoAhorro";
import { OrigenMovimiento } from "@/pages/admin/OrigenMovimiento";
import { LuMove3D } from "react-icons/lu";
// import { TipoMovimiento } from "@/pages/admin/TipoMovimiento";
import { FaArrowsUpDown } from "react-icons/fa6";
import { TabTipoMovimiento } from "@/pages/admin/TabTipoMovimiento";
import { CuentaHistorial } from "../pages/cuenta/Historial";
import { GraficasContainer } from "../pages/cuenta/Graficas";

let routesItems = [];


const adminRutas = [
  {
    label: "Administrador",
    identifier: "admin",
    roles: ["admin",],
    items: [
      {
        to: "tipo_meta",
        label: "Tipos de metas",
        icon: GiStairsGoal,
        children: <TipoMeta />,
      },
      {
        to: "tipo_movimiento",
        label: "Tipos de movimientos",
        icon: FaArrowsUpDown,
        children: <TabTipoMovimiento tipo="admin" />,
      },
      {
        to: "tipo_ahorro",
        label: "Tipos de ahorros",
        icon: TbPigMoney,
        children: <TipoAhorro tipo="admin" />,
      },
      {
        to: "origen_movimiento",
        label: "Origen movimiento",
        icon: LuMove3D,
        children: <OrigenMovimiento />,
      },
    ],
  },
];

const userConfig = [
  {
    label: "Configuracion",
    identifier: "config",
    // roles: ["admin",],
    items: [
      {
        to: "tipo_ahorro",
        label: "Tipos de ahorros",
        icon: TbPigMoney,
        children: <TipoAhorro />,
      },
      {
        to: "tipo_movimiento",
        label: "Tipos de movimientos",
        icon: FaArrowsUpDown,
        children: <TabTipoMovimiento />,
      },
    ],
  },
];

const historial = [
  {
    label: "Historial",
    identifier: "history",
    // roles: ["admin",],
    items: [
      {
        to: "cuenta/:cuenta_id",
        label: "Historial de cuenta",
        navbar:false,
        children:<CuentaHistorial />,
      },
      {
        to: "graficas/:cuenta_id",
        label: "Graficas de cuenta",
        navbar:false,
        children:<GraficasContainer />,
      },
    ],
  },
]

routesItems = [
  ...adminRutas,
  ...historial,
  ...userConfig,
];

export { routesItems };
