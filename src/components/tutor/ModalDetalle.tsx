import React from 'react';
import { useEstudiantes } from '../../store/useEstudiantes';
import { useMaterias } from '../../store/useMaterias';
import { calcularCreditos, determinarNivelRiesgo, COLORES_RIESGO } from '../../utils/calcularRiesgo';
import { IndicadorRiesgo } from '../common/IndicadorRiesgo';
import type { Estudiante } from '../../types';

interface Props {
  estudiante: Estudiante & { creditos: number; apellidos: string };
  onCerrar: () => void;
}

export const ModalDetalle: React.FC<Props> = ({ estudiante, onCerrar }) => {
  const { actualizarEstado } = useEstudiantes();
  const { getMateriaById, materias } = useMaterias();
  const nivel = determinarNivelRiesgo(estudiante.puntajeRiesgo);
  const color = COLORES_RIESGO[nivel];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {estudiante.primerApellido} {estudiante.segundoApellido}, {estudiante.nombre}
            </h3>
            <p className="text-sm text-gray-500">Semestre {estudiante.semestre}</p>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
            <IndicadorRiesgo puntaje={estudiante.puntajeRiesgo} mostrarTexto />
            <div>
              <p className="font-semibold" style={{ color }}>
                Riesgo {nivel === 'ALTO' ? 'Alto' : nivel === 'MEDIO' ? 'Medio' : 'Bajo'}
              </p>
              <p className="text-sm text-gray-600">Puntaje: {estudiante.puntajeRiesgo} puntos</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Carga Académica Propuesta</h4>
            <div className="grid grid-cols-2 gap-2">
              {estudiante.materiasProguestas.map(id => {
                const m = getMateriaById(id);
                const esEspecial = estudiante.materiasEspeciales.includes(id);
                return (
                  <div key={id} className={`p-2 rounded-lg text-sm border ${esEspecial ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="font-medium">{m?.nombre}</p>
                    <p className="text-xs text-gray-500">{m?.codigo} • {m?.creditos} cr {esEspecial ? '⭐' : ''}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Total: {calcularCreditos(estudiante.materiasProguestas, materias)} créditos
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Alertas Automáticas</h4>
            <div className="space-y-2">
              {estudiante.materiasEspeciales.length >= 2 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm text-red-700">
                  ⚠️ Tiene {estudiante.materiasEspeciales.length} materias especiales
                </div>
              )}
              {estudiante.materiasRepetidas.length >= 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-sm text-orange-700">
                  ⚠️ Tiene {estudiante.materiasRepetidas.length} materias repetidas
                </div>
              )}
              {estudiante.creditos > 36 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-sm text-red-700">
                  ⚠️ Excede el límite de 36 créditos ({estudiante.creditos} créditos)
                </div>
              )}
              {estudiante.creditos < 20 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm text-yellow-700">
                  ⚠️ Carga por debajo del mínimo de 20 créditos ({estudiante.creditos} créditos)
                </div>
              )}
              {estudiante.materiasEspeciales.length < 2 &&
               estudiante.materiasRepetidas.length < 3 &&
               estudiante.creditos >= 20 &&
               estudiante.creditos <= 36 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-700">
                  ✅ Sin alertas activas
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {estudiante.estado !== 'APROBADO' && (
              <button
                onClick={() => {
                  actualizarEstado(estudiante.id, 'APROBADO');
                  onCerrar();
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                ✅ Aprobar Carga
              </button>
            )}
            <button
              onClick={onCerrar}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
