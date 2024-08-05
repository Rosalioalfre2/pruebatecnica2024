/* eslint-disable react/prop-types */
import Layout from "@/layouts/navbar-sidebar";
import { useParams } from "react-router-dom";
import { axiosApi } from '@/libs/axios';
import { useEffect, useState } from "react";
import { notify } from "@/components/toast";
import { tm_corriente, om_ingreso, om_gasto} from '@/const/finanzas'
import {Container, Row, Col} from '../../components/ui/Index'

const CuentaHistorial = () =>{
  const { cuenta_id } = useParams();
  const [movimientos, setMovimientos] = useState([])
  const [cuenta, setCuenta] = useState({})
  
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
    getCuentaHistorial();
    getCuenta();
  },[])
  
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
      </Container>
      <Container className="mt-4">
        <Row>
          <Col>{movimientos.length == 0 && <h3 className="text-2xl font-semibold text-center">No se ha registrado movimientos en esta cuenta</h3>}</Col>
          <Col><CardMovimiento movimientos={movimientos} /></Col>
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
