import { axiosApi } from '@/libs/axios';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from '@/components/ui/Index';
import { CuentaCard } from './components/CuentaCard';
import { FormCuenta } from './components/FormCuenta';

const Cuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [actualiza, setActualiza] = useState(0)

  useEffect(() => {
    const fetchCuentas = async () => {
      let result = await getCuentas();
      if (Array.isArray(result)) {
        setCuentas(result);
      }
    };

    fetchCuentas();
  }, [actualiza]);

  return (
    <Container className="space-y-2">
      <Row>
        <Col>
          <h2 className="text-2xl font-semibold text-center">Mis cuentas de ahorros</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormCuenta actualiza={actualiza} setActualiza={setActualiza} />
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
              <CuentaCard cuenta={cuenta} actualiza={actualiza} setActualiza={setActualiza} />
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
    }
  } catch (error) {
    result = [];
  }
  return result;
};

export { Cuentas };
