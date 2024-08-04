import { GiStairsGoal } from "react-icons/gi";

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
        children: <></>,
      },
    ],
  },
];

routesItems = [
  ...adminRutas,
];

export { routesItems };
