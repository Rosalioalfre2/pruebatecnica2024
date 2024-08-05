/* eslint-disable react/prop-types */
import { tm_corriente, om_ingreso, om_gasto } from '@/const/finanzas';
import {FormCuenta} from './FormCuenta'
import { axiosApi } from '@/libs/axios';
import { notify } from "@/components/toast";
import { useEffect, useState } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure} from "@nextui-org/react";
import { Label, Select, TextInput } from 'flowbite-react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const CuentaCard = ({ cuenta, actualiza, setActualiza, tipoAhorro }) => {
  const navigate = useNavigate();

  const deleteCuenta = async (id) =>{
    try{
      const response = await axiosApi.post('/finanza/api/cuenta?op=deleteCuenta',{id})
      if (response.status === 200) {
        
        if(response.data.success && response.data.message){
          notify(response.data.message, response.data.success ? 'success' : 'warning')
        }
      }

      if(response.status == 200){
        setActualiza(actualiza + 1)
      }
    }
    catch(error){
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
  }
  
  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <div className="px-6 py-4">
        <div className='text-3xl font-semibold'>Cantidad: ${cuenta.cantidad}</div>
        <div className="font-bold text-2xl mb-2 text-gray-900 dark:text-white">{cuenta.nombre}</div>
        <p className="text-gray-700 dark:text-gray-300 text-xl">
          Tipo de ahorro: <span className='font-bold'>{cuenta.tipo_ahorro_nombre}</span> <br />
          {cuenta.tipo_meta !== tm_corriente && (
            <>
              Tipo de meta: <span className='font-bold'>{cuenta.tipo_meta_nombre}</span> <br />
            </>
          )}
        </p>
        <div className='font-bold mt-4'>{cuenta.tipo_meta != tm_corriente &&
            (<span className={`p-4 rounded-xl ${cuenta.meta_alcanzada ? "bg-green-500 dark:bg-green-600" : "bg-red-400 dark:bg-red-600" }`}>{cuenta.meta_alcanzada ? 'Meta alcanzada' : 'Meta no alcanzada'}</span>)}
        </div>
      </div>
      {cuenta.cantidad_objetivo && (
        <div className="px-6 pt-2 pb-2">
          <span className="inline-block bg-green-400 dark:bg-green-700 rounded-full px-3 py-1 text-lg font-semibold text-gray-700 dark:text-gray-100 mr-2 mb-2">
            Objetivo: ${cuenta.cantidad_objetivo}
          </span>
        </div>
      )}
      {cuenta.fecha_objetivo && (
        <div className="px-6 pt-2 pb-2">
          <span className="inline-block bg-blue-400 dark:bg-blue-700 rounded-full px-3 py-1 text-lg font-semibold text-gray-700 dark:text-gray-100 mr-2 mb-2">
            Fecha objetivo: {cuenta.fecha_objetivo}
          </span>
        </div>
      )}
      <div className="px-6 pt-2 pb-2 flex flex-col md:flex-row justify-end gap-2">
        <Button auto flat color="danger" onClick={()=>deleteCuenta(cuenta.id)}>
          Eliminar
        </Button>
        <FormCuenta cuenta={cuenta} editar={true} actualiza={actualiza} setActualiza={setActualiza} tipoAhorro={tipoAhorro} />
        <Button color='warning' onClick={()=>
        navigate(
          `/history/cuenta/${cuenta.id}/`,
        )}>Historial</Button>
        <MovimientoModal cuenta_id={cuenta.id} actualiza={actualiza} setActualiza={setActualiza} origen={om_gasto} color="secondary" />
        <MovimientoModal cuenta_id={cuenta.id} actualiza={actualiza} setActualiza={setActualiza} origen={om_ingreso} color="primary" />
      </div>
    </div>
  );
};

export { CuentaCard };

const MovimientoModal = ({cuenta_id, origen, color, setActualiza, actualiza}) =>{
  const [movimientos, setMovimientos] = useState([])
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const getMovimientos = async () =>{
    let result = [];
    try {
      const response = await axiosApi(`/finanza/TipoMovimiento?op=select&origen=${origen}`);
      if (response.status === 200) {
        if(response.data.results){
          result = response.data.results
        }
      }
    } catch (error) {
      result = [];
    }
    return result;
  }

  useEffect(()=>{
    if(!isOpen){
      return
    }

    const fetchMovimiento = async () => {
      let result = await getMovimientos();
      if (Array.isArray(result)) {
        setMovimientos(result);
      }
    };

    fetchMovimiento();
  },[isOpen])

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data) => {
    const cerrar = await addMovimiento(data, cuenta_id, setActualiza, actualiza);
    if(cerrar){
      handleClose();
    }
  };

  return (
    <>
      <Button onPress={onOpen} color={color}>Registrar {origen == om_ingreso ? "ingreso" : "gasto"}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Registrar {origen == om_ingreso ? "ingreso" : "gasto"}</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label value="Cantidad" />
                    </div>
                    <TextInput
                      type="number"
                      addon="$"
                      {...register('cantidad', { 
                        required: "Este campo es requerido", 
                        min: { value: 0.01, message: "Debe tener al menos $0.01" } 
                      })}
                      step="0.01"
                    />
                    {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}
                  </div>


                  <div>
                      <div className="mb-2 block">
                        <Label value="Fecha" />
                      </div>
                      <input
                        type="date"
                        autoComplete="off"
                        className={
                          "w-full bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2"
                        }
                        {...register('fecha', {
                          required:"Este campo es obligatorio",
                        })}
                      />
                      {errors.fecha && <p className="text-red-500">{errors.fecha.message}</p>}
                    </div>
                  
                  <div>
                    <div className="mb-2 block">
                      <Label value={`Tipo de ${origen == om_ingreso ? "ingreso" : "gasto"}`} />
                    </div>
                    <Select {...register('tipo_movimiento_id',{
                      required: "Este campo es obligatorio",
                    })}>
                      <option></option>
                      {movimientos.map((tipo, index)=>(
                        <option key={index} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </Select>
                    {errors.tipo_movimiento_id && <p className="text-red-500">{errors.tipo_movimiento_id.message}</p>}
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button color="danger" variant="light" onPress={handleClose}>
                      Cancelar
                    </Button>
                    <Button color="success" type="submit">
                      Registrar {origen == om_ingreso ? "ingreso" : "gasto"}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const addMovimiento = async (data, cuenta_id, setActualiza, actualiza) =>{
  try {
    const response = await axiosApi.post(`/finanza/api/movimiento?op=registerMovimiento`, {...data, cuenta_id});
    if (response.status === 200) {
      
      if(response.data.success && response.data.message){
        notify(response.data.message, response.data.success ? 'success' : 'warning')
      }
    }
    setActualiza(actualiza + 1)
  } catch (error) {
    if(error.response.status == 400 && error.response.data.errors){
      notify(JSON.stringify(error.response.data.errors), 'error')
    }
    else{
      notify('Ooops, algo salio mal, vuelva intentar.', 'error')
    }
    return false;
  }
  return true;
}