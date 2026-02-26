import React from 'react';
import { useWizard } from '../../store/useWizard';
import { useMaterias } from '../../store/useMaterias';
import { BotonPaso } from '../common/BotonPaso';

const RAZONES_DISPONIBLES = [
  'Dificultad con el contenido del curso',
  'Problemas personales o familiares',
  'Problemas de salud',
  'Carga académica excesiva',
  'Problemas económicos',
  'Conflicto de horario',
  'Ausentismo',
  'Falta de preparación previa',
  'Otro',
];

export const Paso4RazonesReprobacion: React.FC = () => {
  const { materiasReprobadas, razones, actualizarRazones, siguientePaso, anteriorPaso } = useWizard();
  const { getMateriaById } = useMaterias();

  const getRazon = (materiaId: string) =>
    razones.find(r => r.materiaId === materiaId)?.razon || '';

  const setRazon = (materiaId: string, razon: string) => {
    const nuevasRazones = razones.filter(r => r.materiaId !== materiaId);
    if (razon) nuevasRazones.push({ materiaId, razon });
    actualizarRazones(nuevasRazones);
  };

  const todasConRazon = materiasReprobadas.every(id => getRazon(id));

  if (materiasReprobadas.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Paso 4: Razones de Reprobación</h2>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium">✅ No tiene materias reprobadas este semestre.</p>
        </div>
        <div className="flex justify-between">
          <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
          <BotonPaso onClick={siguientePaso}>Siguiente →</BotonPaso>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 4: Razones de Reprobación</h2>
        <p className="text-gray-500 text-sm mt-1">Seleccione una razón para cada materia reprobada.</p>
      </div>
      <div className="space-y-4">
        {materiasReprobadas.map(materiaId => {
          const materia = getMateriaById(materiaId);
          return (
            <div key={materiaId} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{materia?.nombre || materiaId}</p>
                  <p className="text-xs text-gray-500 mb-2">{materia?.codigo}</p>
                  <select
                    value={getRazon(materiaId)}
                    onChange={e => setRazon(materiaId, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Seleccione una razón --</option>
                    {RAZONES_DISPONIBLES.map(razon => (
                      <option key={razon} value={razon}>{razon}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
        <BotonPaso onClick={siguientePaso} disabled={!todasConRazon}>Siguiente →</BotonPaso>
      </div>
    </div>
  );
};
