import React from 'react';
import { useWizard } from '../../store/useWizard';
import { useMaterias } from '../../store/useMaterias';
import { BotonPaso } from '../common/BotonPaso';

export const Paso3MateriasReprobadas: React.FC = () => {
  const { materiasReprobadas, actualizarMateriasReprobadas, siguientePaso, anteriorPaso } = useWizard();
  const { materias } = useMaterias();

  const toggleMateria = (id: string) => {
    if (materiasReprobadas.includes(id)) {
      actualizarMateriasReprobadas(materiasReprobadas.filter(m => m !== id));
    } else {
      actualizarMateriasReprobadas([...materiasReprobadas, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 3: Materias Reprobadas</h2>
        <p className="text-gray-500 text-sm mt-1">
          Seleccione las materias que reprobó este semestre.
        </p>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">📋 Detección automática:</span> Las materias reprobadas fueron identificadas desde su historial académico.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {materias.map(materia => (
          <label
            key={materia.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              materiasReprobadas.includes(materia.id)
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={materiasReprobadas.includes(materia.id)}
              onChange={() => toggleMateria(materia.id)}
              className="w-4 h-4 text-red-500"
            />
            <div>
              <p className="font-medium text-sm text-gray-800">{materia.nombre}</p>
              <p className="text-xs text-gray-500">{materia.codigo} • {materia.creditos} créditos</p>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
        <BotonPaso onClick={siguientePaso}>Siguiente →</BotonPaso>
      </div>
    </div>
  );
};
