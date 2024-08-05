/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { axiosApi } from "@/api/api";
import { notify } from "@/components/toast";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useThemeMode } from "flowbite-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);
import { om_ingreso, om_gasto, tm_corriente } from '@/const/finanzas'
import {Container, Row, Col, NavTabs} from '../../components/ui/Index'
import Layout from "@/layouts/navbar-sidebar";
import { FaCalendarWeek, FaClock } from "react-icons/fa6";

const GraficasContainer = () =>{
  const [cuenta, setCuenta] = useState({})
  const { cuenta_id } = useParams();
  const [movimientos, setMovimientos] = useState([])

  const getCuentaHistorial = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/movimiento?op=chartMovimientos', {cuenta_id});
      if (response.status === 200) {
        if(response.data){
          setMovimientos(response.data)
        }
      }
    } catch (error) {
      setMovimientos([])
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
  }

  const getCuenta = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/cuenta?op=getCuenta', {cuenta_id});
      if (response.status === 200) {
        if(response.data){
          setCuenta(response.data)
        }
      }
    } catch (error) {
      setCuenta({})
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }   
  }

  useEffect(()=>{
    getCuenta();
    getCuentaHistorial();
  },[])
  
  const tabsItems = [
    {
      title: "Todos los movimientos - Barras",
      icon: FaClock,
      children: <IngresosYGastosBar movimientos={movimientos} />,
    },
    {
      title: "Todos los movimientos - Lineas",
      icon: FaClock,
      children: <IngresosYGastosLine movimientos={movimientos} />,
    },
    {
      title: "Ingresos y gastos semanales - Barras",
      icon: FaCalendarWeek,
      children: <IngresosYGastosSemanaBar cuenta_id={cuenta_id} />,
    },
    {
      title: "Ingresos y gastos mensuales - Lineas",
      icon: FaCalendarWeek,
      children: <IngresosYGastosMesLine cuenta_id={cuenta_id} />,
    },
  ];
  
  return (
    <Layout title="Historial de la cuenta">
      <Container className="bg-slate-400 dark:bg-slate-950 p-4 rounded-xl">
        <Row>
          <Col><h2 className="text-3xl font-semibold">Ingresos y gastos de la cuenta: {cuenta.nombre}</h2></Col>
        </Row>
        <Row>
          <Col>
            <p className="text-xl">Saldo actual: <span className="font-bold">{cuenta.cantidad}</span></p>
            <p className="text-xl">Cantidad inicial: <span className="font-bold">{cuenta.cantidad_inicial}</span></p>
          </Col>
        </Row>
        <Row>
          <Col size={50}>
            {cuenta.tipo_meta_id != tm_corriente && <p className="text-xl">Meta alcanzada: <span className="font-bold">{cuenta.meta_alcanzada ? "Si" : "No"}</span></p>}
          </Col>
          {cuenta.cantidad_objetivo && <Col size={50}><p className="text-xl">Cantidad objetivo: <span className="font-bold">{cuenta.cantidad_objetivo}</span></p></Col>}
          {cuenta.fecha_objetivo && <Col size={50}><p className="text-xl">Fecha objetivo: <span className="font-bold">{cuenta.fecha_objetivo}</span></p></Col>}
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col>{movimientos.length == 0 && <h3 className="text-2xl font-semibold text-center">No se ha registrado movimientos en esta cuenta</h3>}</Col>
          <Col>
            <NavTabs items={tabsItems} />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export {GraficasContainer}


const IngresosYGastosBar = ({movimientos}) => {
  const { mode } = useThemeMode();

  const options = {
    indexAxis: "x",
    elements: {
      bar: {
        borderWidth: 2,
        barThickness: 20,
        maxBarThickness: 40,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: mode == "dark" ? "#D7DBDD " : "#5D5D5D" },
      },
      title: {
        display: false,
        text: "Ingresos y gastos por dia",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value.toString(),
        color: mode == "dark" ? "#F8F8FF" : "#232323",
      },
    },
    scales: {
      x: {
        ticks: {
          color: mode == "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          color: mode == "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
    },
  };

  const groupedData = movimientos.reduce((acc, item) => {
    const date = item.fecha;
    if (!acc[date]) {
      acc[date] = { ingresos: 0, gastos: 0 };
    }
    if (item.origen_id === om_ingreso) {
      acc[date].ingresos += parseFloat(item.cantidad);
    } else if (item.origen_id === om_gasto) {
      acc[date].gastos += parseFloat(item.cantidad);
    }
    return acc;
  }, {});
  
  const labels = Object.keys(groupedData);
  const ingresos = labels.map(label => groupedData[label].ingresos);
  const gastos = labels.map(label => groupedData[label].gastos);
  
  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Gastos",
        data: gastos,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const totalIngresos = movimientos.reduce(
    (total, item) => {
      if (item.origen_id == om_ingreso && item.cantidad) {
        return total + parseFloat(item.cantidad);
      }
      return total;
    },
    0,
  );

  const totalGastos = movimientos.reduce(
    (total, item) => {
      if (item.origen_id == om_gasto && item.cantidad) {
        return total + parseFloat(item.cantidad);
      }
      return total;
    },
    0,
  );

  return (
    <div className="flex flex-col items-center p-4">
      {movimientos.length > 0 && (
        <h2 className="mb-2 text-center text-xl">{`Ingresos: $${totalIngresos} - Gastos: $${totalGastos}`}</h2>
      )}
      <div className="h-64 w-full overflow-auto md:h-full">
        <div
          style={{ maxWidth: "100%", minHeight: "40rem", maxHeight: "80rem" }}
        >
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

const IngresosYGastosLine = ({ movimientos }) => {
  const { mode } = useThemeMode();

  const options = {
    indexAxis: "x",
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: mode === "dark" ? "#D7DBDD " : "#5D5D5D" },
      },
      title: {
        display: false,
        text: "Ingresos y gastos por día",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value.toString(),
        color: mode === "dark" ? "#F8F8FF" : "#232323",
      },
    },
    scales: {
      x: {
        ticks: {
          color: mode === "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          color: mode === "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
    },
  };

  const groupedData = movimientos.reduce((acc, item) => {
    const date = item.fecha;
    if (!acc[date]) {
      acc[date] = { ingresos: 0, gastos: 0 };
    }
    if (item.origen_id === om_ingreso) {
      acc[date].ingresos += parseFloat(item.cantidad);
    } else if (item.origen_id === om_gasto) {
      acc[date].gastos += parseFloat(item.cantidad);
    }
    return acc;
  }, {});

  const labels = Object.keys(groupedData);
  const ingresos = labels.map(label => groupedData[label].ingresos);
  const gastos = labels.map(label => groupedData[label].gastos);

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
      {
        label: "Gastos",
        data: gastos,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
      },
    ],
  };

  const totalIngresos = movimientos.reduce(
    (total, item) => {
      if (item.origen_id === om_ingreso && item.cantidad) {
        return total + parseFloat(item.cantidad);
      }
      return total;
    },
    0,
  );

  const totalGastos = movimientos.reduce(
    (total, item) => {
      if (item.origen_id === om_gasto && item.cantidad) {
        return total + parseFloat(item.cantidad);
      }
      return total;
    },
    0,
  );

  return (
    <div className="flex flex-col items-center p-4">
      {movimientos.length > 0 && (
        <h2 className="mb-2 text-center text-xl">{`Ingresos: $${totalIngresos} - Gastos: $${totalGastos}`}</h2>
      )}
      <div className="h-64 w-full overflow-auto md:h-full">
        <div
          style={{ maxWidth: "100%", minHeight: "40rem", maxHeight: "80rem" }}
        >
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};


const IngresosYGastosSemanaBar = ({cuenta_id}) => {
  const { mode } = useThemeMode();
  const [movimientos, setMovimientos] = useState([])
  
  const getCuentaHistorialWeek = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/movimiento?op=listMovimientosPorSemana', {cuenta_id});
      if (response.status === 200) {
        if(response.data){
          setMovimientos(response.data)
        }
      }
    } catch (error) {
      setMovimientos([])
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
  }

  useEffect(()=>{
    getCuentaHistorialWeek();
  },[])

  const options = {
    indexAxis: "x",
    elements: {
      bar: {
        borderWidth: 2,
        barThickness: 20,
        maxBarThickness: 40,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: mode === "dark" ? "#D7DBDD" : "#5D5D5D" },
      },
      title: {
        display: false,
        text: "Ingresos y gastos por semana",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value.toString(),
        color: mode === "dark" ? "#F8F8FF" : "#232323",
      },
    },
    scales: {
      x: {
        ticks: {
          color: mode === "dark" ? "#D7DBDD" : "#5D5D5D",
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          color: mode === "dark" ? "#D7DBDD" : "#5D5D5D",
        },
      },
    },
  };

  const labels = movimientos.map((item) => `${item.semana_inicio} - ${item.semana_fin}`);
  const ingresos = movimientos.map((item) => parseFloat(item.ingresos_total));
  const gastos = movimientos.map((item) => parseFloat(item.gastos_total));
  const acumulado = movimientos.map((item) => parseFloat(item.cantidad_acumulada));

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Gastos",
        data: gastos,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Acumulado",
        data: acumulado,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso, 0);
  const totalGastos = gastos.reduce((total, gasto) => total + gasto, 0);

  return (
    <div className="flex flex-col items-center p-4">
      {movimientos.length > 0 && (
        <h2 className="mb-2 text-center text-xl">{`Ingresos: $${totalIngresos} - Gastos: $${totalGastos}`}</h2>
      )}
      <div className="h-64 w-full overflow-auto md:h-full">
        <div style={{ maxWidth: "100%", minHeight: "40rem", maxHeight: "80rem" }}>
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

const IngresosYGastosMesLine = ({ cuenta_id }) => {
  const { mode } = useThemeMode();
  const [movimientos, setMovimientosMes] = useState([])
  
  const getCuentaHistoriaMonth = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/movimiento?op=listMovimientosPorMes', {cuenta_id});
      if (response.status === 200) {
        if(response.data){
          setMovimientosMes(response.data)
        }
      }
    } catch (error) {
      setMovimientosMes([])
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
  }

  useEffect(()=>{
    getCuentaHistoriaMonth();
  },[])

  const options = {
    indexAxis: "x",
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: mode === "dark" ? "#D7DBDD " : "#5D5D5D" },
      },
      title: {
        display: false,
        text: "Ingresos, Gastos y Acumulado por mes",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value) => value.toString(),
        color: mode === "dark" ? "#F8F8FF" : "#232323",
      },
    },
    scales: {
      x: {
        ticks: {
          color: mode === "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
      y: {
        ticks: {
          autoSkip: false,
          color: mode === "dark" ? "#D7DBDD " : "#5D5D5D",
        },
      },
    },
  };

  const labels = movimientos.map(item => `${item.inicio_mes} - ${item.fin_mes}`);
  const ingresos = movimientos.map(item => parseFloat(item.ingresos_total));
  const gastos = movimientos.map(item => parseFloat(item.gastos_total));
  const acumulado = movimientos.map(item => parseFloat(item.cantidad_acumulada));

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
      {
        label: "Gastos",
        data: gastos,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: false,
      },
      {
        label: "Cantidad Acumulada",
        data: acumulado,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        fill: false,
      },
    ],
  };

  const totalIngresos = movimientos.reduce((total, item) => total + parseFloat(item.ingresos_total), 0);
  const totalGastos = movimientos.reduce((total, item) => total + parseFloat(item.gastos_total), 0);

  return (
    <div className="flex flex-col items-center p-4">
      {movimientos.length > 0 && (
        <h2 className="mb-2 text-center text-xl">{`Ingresos: $${totalIngresos.toFixed(2)} - Gastos: $${totalGastos.toFixed(2)}`}</h2>
      )}
      <div className="h-64 w-full overflow-auto md:h-full">
        <div
          style={{ maxWidth: "100%", minHeight: "40rem", maxHeight: "80rem" }}
        >
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};