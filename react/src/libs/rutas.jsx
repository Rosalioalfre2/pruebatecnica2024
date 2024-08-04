import { GiStairsGoal } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

// Rutas de admin
import {TipoMeta} from '@/pages/admin/TipoMeta'
import { TipoAhorro } from "@/pages/admin/TipoAhorro";

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
        to: "tipo_ahorro",
        label: "Tipos de ahorros",
        icon: TbPigMoney,
        children: <TipoAhorro tipo="admin" />,
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
    ],
  },
];

routesItems = [
  ...adminRutas,
  ...userConfig
];

export { routesItems };
