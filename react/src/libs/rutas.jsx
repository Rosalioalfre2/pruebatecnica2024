import { GiStairsGoal } from "react-icons/gi";

// Rutas de admin
import {TipoMeta} from '@/pages/admin/TipoMeta'

let routesItems = [];


const adminRutas = [
  {
    label: "Administrador",
    identifier: "admin",
    roles: ["admin",],
    items: [
      {
        to: "tipo_metas",
        label: "Tipos de metas",
        icon: GiStairsGoal,
        children: <TipoMeta />,
      },
    ],
  },
];

routesItems = [
  ...adminRutas,
];

export { routesItems };
