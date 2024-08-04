/* eslint-disable react/prop-types */
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import { VscDiffAdded } from "react-icons/vsc";
import { axiosApi } from '@/libs/axios';
import { useForm } from "react-hook-form";
import { Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { tm_cantidad, tm_fecha} from '@/const/finanzas'
import { notify } from "@/components/toast";

const getTipoAhorro = async () =>{
  let result = [];
  try {
    const response = await axiosApi('/finanza/TipoAhorro/?op=select');
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

const FormCuenta = ({ editar=false, cuenta=null, actualiza, setActualiza }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [tipoAhorro, setTipoAhorro] = useState([]);
  const [tipoMeta, setTipoMeta] = useState(null);

  const handleClose = () => {
    reset(); // Resetea el formulario
    onOpenChange(false); // Cierra el modal
  };

  const addCuenta = async (data) => {
    let result = [];
    try {
      const response = await axiosApi.post('/finanza/api/cuenta?op=addCuenta', data);
      if (response.status === 200) {
        result = response.data;
        
        if(response.data.success && response.data.message){
          notify(response.data.message, response.data.success ? 'success' : 'warning')
        }
      }
      setActualiza(actualiza + 1)
    } catch (error) {
      result = [];
      if(error.response.status == 400 && error.response.data.errors){
        notify(JSON.stringify(error.response.data.errors), 'error')
      }
      else{
        notify('Ooops, algo salio mal, vuelva intentar.', 'error')
      }
    }
    return result;
  };

  useEffect(() => {
    const fetchTipoAhorro = async () => {
      let result = await getTipoAhorro();
      if (Array.isArray(result)) {
        setTipoAhorro(result);
      }
    };

    fetchTipoAhorro();
  }, []);

  useEffect(() => {
    const theTipoAhorro = tipoAhorro.find(tipo => tipo.id == watch('tipo_ahorro_id'));
    if(theTipoAhorro){
      setTipoMeta(theTipoAhorro.tipo_meta);
    }
  }, [watch('tipo_ahorro_id')]);

  useEffect(() => {
    if (editar && cuenta) {
      // Cargar datos iniciales al formulario
      reset({
        nombre: cuenta.nombre || '',
        cantidad: cuenta.cantidad || '',
        tipo_ahorro_id: cuenta.tipo_ahorro_id || '',
        cantidad_objetivo: cuenta.cantidad_objetivo || '',
        fecha_objetivo: cuenta.fecha_objetivo || '',
        id: cuenta.id || ''
      });
      const theTipoAhorro = tipoAhorro.find(tipo => tipo.id == cuenta.tipo_ahorro_id);
      if (theTipoAhorro) {
        setTipoMeta(theTipoAhorro.tipo_meta);
      }
      // onOpen();
    }
  }, [editar, cuenta, tipoAhorro]);

  const onSubmit = async (data) => {
    await addCuenta(data);
    handleClose();
  };

  return (
    <>
      <Button onPress={onOpen} color="success" startContent={<VscDiffAdded />}>{editar ? 'Editar cuenta' : 'Agregar cuenta'}</Button>
      <Modal isOpen={isOpen} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }} placement="center" size="3xl">
        <ModalContent className="overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{editar ? 'Editar cuenta' : 'Agregar cuenta'}</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label value="Nombre de la cuenta" />
                    </div>
                    <TextInput
                      type="text"
                      {...register('nombre', { 
                        required: "Este campo es requerido", 
                        minLength: { value: 3, message: "Debe tener al menos 3 caracteres" } 
                      })}
                    />
                    {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
                  </div>

                  {!editar && (
                    <div>
                      <div className="mb-2 block">
                        <Label value="Cantidad inicial" />
                      </div>
                      <TextInput
                        type="number"
                        addon="$"
                        {...register('cantidad', { 
                          required: "Este campo es requerido", 
                          min: { value: 1, message: "Debe tener al menos $1" } 
                        })}
                        step="0.01"
                      />
                      {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}
                    </div>
                  )}

                  <div>
                    <div className="mb-2 block">
                      <Label value="Tipo de ahorro" />
                    </div>
                    <Select {...register('tipo_ahorro_id',{
                      required: "Este campo es obligatorio",
                    })}>
                      <option></option>
                      {tipoAhorro.map((tipo, index)=>(
                        <option key={index} value={tipo.id}>{tipo.nombre} - {tipo.nombre_tipo_meta}</option>
                      ))}
                    </Select>
                    {errors.tipo_ahorro_id && <p className="text-red-500">{errors.tipo_ahorro_id.message}</p>}
                  </div>

                  {[tm_cantidad].includes(tipoMeta) && (
                    <div>
                      <div className="mb-2 block">
                        <Label value="Cantidad objetivo" />
                      </div>
                      <TextInput
                        type="number"
                        addon="$"
                        {...register('cantidad_objetivo', {
                          required: [tm_cantidad].includes(tipoMeta) ? "Este campo es requerido" : false, 
                          min: { value: editar ? 0 : watch('cantidad')??1, message: `Debe tener al menos $${editar ? 0 : watch('cantidad')??1}` } 
                        })}
                        step="0.01"
                      />
                      {errors.cantidad_objetivo && <p className="text-red-500">{errors.cantidad_objetivo.message}</p>}
                    </div>
                  )}

                  {[tm_fecha].includes(tipoMeta) && (
                    <div>
                      <div className="mb-2 block">
                        <Label value="Fecha objetivo" />
                      </div>
                      <input
                        type="date"
                        autoComplete="off"
                        className={
                          "w-full bg-gray-100 text-black dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md mb-2"
                        }
                        {...register('fecha_objetivo', {
                          required: [tm_fecha].includes(tipoMeta) ? "Este campo es requerido" : false,
                        })}
                      />
                      {errors.fecha_objetivo && <p className="text-red-500">{errors.fecha_objetivo.message}</p>}
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <Button color="danger" variant="light" onPress={handleClose}>
                      Cancelar
                    </Button>
                    <Button color="success" type="submit">
                      {editar ? 'Actualizar cuenta' : 'Agregar cuenta'}
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
};

export { FormCuenta };
