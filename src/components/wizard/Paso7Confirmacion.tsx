import React from 'react';
import { useWizard } from '../../store/useWizard';
import { useMaterias } from '../../store/useMaterias';
import { calcularCreditos } from '../../utils/calcularRiesgo';

export const Paso7Confirmacion: React.FC = () => {
  const { datosPersonales, cargaAcademica, materiasReprobadas, razones, reiniciar } = useWizard();
  const { materias, getMateriaById } = useMaterias();

  const creditos = calcularCreditos(cargaAcademica, materias);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">¡Solicitud Enviada!</h2>
        <p className="text-gray-500 mt-2">Su carga académica ha sido enviada exitosamente para revisión del tutor.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Resumen de la solicitud</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Estudiante</p>
            <p className="font-medium">
              {datosPersonales.nombre} {datosPersonales.primerApellido} {datosPersonales.segundoApellido}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Semestre</p>
            <p className="font-medium">{datosPersonales.semestre}°</p>
          </div>
          <div>
            <p className="text-gray-500">Total de créditos</p>
            <p className="font-bold text-blue-600">{creditos} créditos</p>
          </div>
          <div>
            <p className="text-gray-500">Materias seleccionadas</p>
            <p className="font-medium">{cargaAcademica.length} materias</p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Materias en carga académica:</p>
          <div className="flex flex-wrap gap-2">
            {cargaAcademica.map(id => {
              const m = getMateriaById(id);
              return (
                <span key={id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {m?.codigo} - {m?.nombre}
                </span>
              );
            })}
          </div>
        </div>

        {materiasReprobadas.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-2">Materias reprobadas y razones:</p>
            <div className="space-y-2">
              {materiasReprobadas.map(id => {
                const m = getMateriaById(id);
                const razon = razones.find(r => r.materiaId === id)?.razon;
                return (
                  <div key={id} className="bg-red-50 rounded-lg p-2 text-sm">
                    <span className="font-medium text-red-700">{m?.nombre}</span>
                    <span className="text-gray-600"> — {razon}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={reiniciar}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Solicitud
        </button>
      </div>
    </div>
  );
};
