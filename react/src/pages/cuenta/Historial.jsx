/* eslint-disable react/prop-types */
import Layout from "@/layouts/navbar-sidebar";
import { useParams } from "react-router-dom";
import { axiosApi } from '@/libs/axios';
import { useEffect, useState } from "react";
import { notify } from "@/components/toast";
import { tm_corriente, om_ingreso} from '@/const/finanzas'
import {Container, Row, Col, NavTabs} from '../../components/ui/Index'
import { FaCalendar, FaCalendarWeek, FaClock, FaFileCsv, FaFilePdf } from "react-icons/fa6";
import { Button } from "@nextui-org/react";

const CuentaHistorial = () =>{
  const { cuenta_id } = useParams();
  const [movimientos, setMovimientos] = useState([])
  const [movimientosSemana, setMovimientosSemana] = useState([])
  const [movimientosMes, setMovimientosMes] = useState([])
  const [cuenta, setCuenta] = useState({})
  const [loading, setLoading] = useState(false)
  
  const getCuentaHistorial = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/movimiento?op=listMovimientos', {cuenta_id});
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
  
  const getCuentaHistorialWeek = async () =>{
    try {
      const response = await axiosApi.post('/finanza/api/movimiento?op=listMovimientosPorSemana', {cuenta_id});
      if (response.status === 200) {
        if(response.data){
          setMovimientosSemana(response.data)
        }
      }
    } catch (error) {
      setMovimientosSemana([])
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
  }
  
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

  const getMovimientoCSV = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.post(
        "/finanza/api/movimiento?op=listMovimientosCSV",
        {
          cuenta_id
        },
        // {
        //   responseType: "blob",
        // },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "movimientos.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      // }
    } catch (error) {
      notify("Error en la petición", "error");
    } finally {
      setLoading(false);
    }
  };

  const getMovimientoPDF = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.post(
        "/finanza/api/movimiento?op=listMovimientosPDF",
        {
          cuenta_id
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "movimientos.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      // }
    } catch (error) {
      notify("Error en la petición", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getCuentaHistorial();
    getCuenta();
    getCuentaHistoriaMonth();
    getCuentaHistorialWeek();
  },[])


  const tabsItems = [
    {
      title: "Todos los movimientos",
      icon: FaClock,
      children: <CardMovimiento movimientos={movimientos} />,
    },
    {
      title: "Movimiento por semana",
      icon: FaCalendarWeek,
      children: <CardMovimientoSemana movimientos={movimientosSemana} />,
    },
    {
      title: "Movimiento por mes",
      icon: FaCalendar,
      children: <CardMovimientoMes movimientos={movimientosMes} />,
    },
  ];
  
  return (
    <Layout title="Historial de la cuenta">
      <Container className="bg-slate-400 dark:bg-slate-950 p-4 rounded-xl">
        <Row>
          <Col><h2 className="text-3xl font-semibold">Cuenta: {cuenta.nombre}</h2></Col>
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
        <Row>
          <Col className="flex flex-col md:flex-row mt-2 gap-4">
            <Button color="success" startContent={<FaFileCsv />} onClick={getMovimientoCSV} isLoading={loading}>
              Generar CSV
            </Button>
            <Button color="primary" startContent={<FaFilePdf />} onClick={getMovimientoPDF} isLoading={loading}>
              Generar PDF
            </Button>
          </Col>
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

export {CuentaHistorial}


const CardMovimiento = ({movimientos}) =>{
  return (
    <div className="w-full flex flex-col">
      {movimientos.map((movimiento, index)=>(
        <div className={`mt-4 space-y-2 p-4 grid grid-cols-1 md:grid-cols-4 gap-2 rounded border-3 ${movimiento.origen_id == om_ingreso 
          ? "bg-green-400 dark:bg-green-800 border-green-800 dark:border-green-600"
          : "bg-red-400 dark:bg-red-800 border-red-800 dark:border-red-600" }`} key={index}>
          <p className="text-2xl font-semibold text-center"><span className="font-bold">{movimiento.origen_nombre}</span></p>
          <p className="text-2xl font-semibold">Cantidad: <span className="font-bold">${movimiento.cantidad}</span></p>
          <p className="text-xl font-semibold">Fecha: <span className="font-bold">{movimiento.fecha}</span></p>
          <p className="text-xl font-semibold">Razon: <span className="font-bold">{movimiento.tipo_movimiento_nombre}</span></p>
        </div>
      ))}
    </div>
  )
}

const CardMovimientoSemana = ({movimientos}) =>{
  return (
    <div className="w-full flex flex-col">
      {movimientos.map((movimiento, index)=>(
        <div className={`mt-4 space-y-2 p-4 grid grid-cols-1 md:grid-cols-4 gap-2 rounded border-3 ${movimiento.bandera == om_ingreso 
          ? "bg-green-400 dark:bg-green-800 border-green-800 dark:border-green-600"
          : "bg-red-400 dark:bg-red-800 border-red-800 dark:border-red-600" }`} key={index}>
          <p className="text-2xl font-semibold text-center"><span className="font-bold">Ingresos: {movimiento.ingresos_total}</span></p>
          <p className="text-2xl font-semibold text-center"><span className="font-bold">Gastos: {movimiento.gastos_total}</span></p>
          <p className="text-2xl font-semibold">Acumulado: <span className="font-bold">${movimiento.cantidad_acumulada}</span></p>
          <p className="text-xl font-semibold">Semana: <span className="font-bold">{movimiento.semana_inicio} - {movimiento.semana_fin}</span></p>
        </div>
      ))}
    </div>
  )
}

const CardMovimientoMes = ({movimientos}) =>{
  return (
    <div className="w-full flex flex-col">
      {movimientos.map((movimiento, index)=>(
        <div className={`mt-4 space-y-2 p-4 grid grid-cols-1 md:grid-cols-4 gap-2 rounded border-3 ${movimiento.bandera == om_ingreso 
          ? "bg-green-400 dark:bg-green-800 border-green-800 dark:border-green-600"
          : "bg-red-400 dark:bg-red-800 border-red-800 dark:border-red-600" }`} key={index}>
          <p className="text-2xl font-semibold text-center"><span className="font-bold">Ingresos: {movimiento.ingresos_total}</span></p>
          <p className="text-2xl font-semibold text-center"><span className="font-bold">Gastos: {movimiento.gastos_total}</span></p>
          <p className="text-2xl font-semibold">Acumulado: <span className="font-bold">${movimiento.cantidad_acumulada}</span></p>
          <p className="text-xl font-semibold">Mes: <span className="font-bold">{movimiento.inicio_mes} - {movimiento.fin_mes}</span></p>
        </div>
      ))}
    </div>
  )
}
