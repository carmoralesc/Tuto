import React from 'react';
import { useWizard } from '../../store/useWizard';
import { BotonPaso } from '../common/BotonPaso';

export const Paso1DatosPersonales: React.FC = () => {
  const { datosPersonales, actualizarDatosPersonales, siguientePaso } = useWizard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    siguientePaso();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 1: Verificar Datos Personales</h2>
        <p className="text-gray-500 text-sm mt-1">Confirme que sus datos sean correctos antes de continuar.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
            <input
              type="text"
              value={datosPersonales.nombre || ''}
              onChange={e => actualizarDatosPersonales({ nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
            <input
              type="text"
              value={datosPersonales.primerApellido || ''}
              onChange={e => actualizarDatosPersonales({ primerApellido: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Primer apellido"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
            <input
              type="text"
              value={datosPersonales.segundoApellido || ''}
              onChange={e => actualizarDatosPersonales({ segundoApellido: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Segundo apellido"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
            <input
              type="number"
              min="1"
              max="10"
              value={datosPersonales.semestre || ''}
              onChange={e => actualizarDatosPersonales({ semestre: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Semestre actual"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <BotonPaso tipo="submit" onClick={() => {}}>Siguiente →</BotonPaso>
        </div>
      </form>
    </div>
  );
};
