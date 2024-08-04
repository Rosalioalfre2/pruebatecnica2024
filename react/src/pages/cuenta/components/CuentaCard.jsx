/* eslint-disable react/prop-types */
import { tm_corriente } from '@/const/finanzas';

const CuentaCard = ({ cuenta }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{cuenta.nombre}</div>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Cantidad: {cuenta.cantidad} <br />
          Tipo de ahorro: {cuenta.tipo_ahorro_nombre} <br />
          {cuenta.tipo_meta !== tm_corriente && (
            <>
              Tipo de meta: {cuenta.tipo_meta_nombre} <br />
            </>
          )}
          { cuenta.tipo_meta != tm_corriente &&
           (cuenta.meta_alcanzada ? 'Meta alcanzada' : 'Meta no alcanzada')}
        </p>
      </div>
      {cuenta.cantidad_objetivo && (
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">
            Objetivo: {cuenta.cantidad_objetivo}
          </span>
        </div>
      )}
      {cuenta.fecha_objetivo && (
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">
            Fecha objetivo: {cuenta.fecha_objetivo}
          </span>
        </div>
      )}
    </div>
  );
};

export { CuentaCard };
