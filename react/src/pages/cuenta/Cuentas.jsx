import { axiosApi } from '@/libs/axios';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from '@/components/ui/Index';
import { CuentaCard } from './components/CuentaCard';
import { FormCuenta } from './components/FormCuenta';
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

const Cuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [actualiza, setActualiza] = useState(0)
  const [tipoAhorro, setTipoAhorro] = useState([]);

  useEffect(() => {
    const fetchCuentas = async () => {
      let result = await getCuentas();
      if (Array.isArray(result)) {
        setCuentas(result);
      }
    };

    fetchCuentas();
  }, [actualiza]);

  useEffect(() => {
    const fetchTipoAhorro = async () => {
      let result = await getTipoAhorro();
      if (Array.isArray(result)) {
        setTipoAhorro(result);
      }
    };

    fetchTipoAhorro();
  }, []);

  return (
    <Container className="space-y-2">
      <Row>
        <Col>
          <h2 className="text-2xl font-semibold text-center">Mis cuentas de ahorros</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormCuenta actualiza={actualiza} setActualiza={setActualiza} tipoAhorro={tipoAhorro} />
        </Col>
      </Row>
      <Row>
        {cuentas.length === 0 ? (
          <Col>
            <h3 className="text-xl font-semibold text-center">No tienes ninguna cuenta registrada, puedes crear una desde el botón crear cuenta</h3>
          </Col>
        ) : (
          cuentas.map((cuenta, index) => (
            <Col key={index} className="p-4">
              <CuentaCard cuenta={cuenta} actualiza={actualiza} setActualiza={setActualiza} tipoAhorro={tipoAhorro} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

const getCuentas = async () => {
  let result = [];
  try {
    const response = await axiosApi.post('/finanza/api/cuenta?op=listCuentas');
    if (response.status === 200) {
      result = response.data;
      
      if(response.data.success && response.data.message){
        notify(response.data.message, response.data.success ? 'success' : 'warning')
      }
    }
  } catch (error) {
    result = [];
  }
  return result;
};

export { Cuentas };
