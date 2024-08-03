let routesItems = [];


const compras = [
  {
    label: "Compras",
    identifier: "compras",
    roles: ["compras"],
    items: [
      {
        to: "#",
        label: "Estatus de contenedores",
        empresa: [3],
      },
      {
        to: "#",
        label: "Requirimiento de suministro de tiendas",
      },
    ],
  },
];

routesItems = [
  ...compras,
];

export { routesItems };
