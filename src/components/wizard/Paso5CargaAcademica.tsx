import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import { useWizard } from '../../store/useWizard';
import { useMaterias } from '../../store/useMaterias';
import { calcularCreditos } from '../../utils/calcularRiesgo';
import { BotonPaso } from '../common/BotonPaso';
import type { Materia } from '../../types';

const MIN_CREDITOS = 20;
const MAX_CREDITOS = 36;
const MAX_ESPECIALES = 2;

interface TarjetaMateriaProps {
  materia: Materia;
  bloqueada?: boolean;
  razonBloqueo?: string;
  enCarga?: boolean;
}

const TarjetaMateria: React.FC<TarjetaMateriaProps> = ({
  materia,
  bloqueada = false,
  razonBloqueo,
  enCarga = false,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: materia.id,
    disabled: bloqueada,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={razonBloqueo}
      className={`p-3 rounded-lg border-2 select-none transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        bloqueada
          ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
          : enCarga
          ? 'border-blue-400 bg-blue-50 cursor-grab active:cursor-grabbing'
          : 'border-gray-300 bg-white cursor-grab active:cursor-grabbing hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm text-gray-800">{materia.nombre}</p>
          <p className="text-xs text-gray-500">{materia.codigo}</p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
          {materia.creditos} cr
        </span>
      </div>
      {bloqueada && razonBloqueo && (
        <p className="text-xs text-red-500 mt-1">🔒 {razonBloqueo}</p>
      )}
    </div>
  );
};

const ZonaArrastreable: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({
  id,
  children,
  className = '',
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`transition-colors ${isOver ? 'bg-blue-100 border-blue-400' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const Paso5CargaAcademica: React.FC = () => {
  const { cargaAcademica, actualizarCargaAcademica, datosPersonales, siguientePaso, anteriorPaso } = useWizard();
  const { materias } = useMaterias();
  const [arrastrandoId, setArrastrandoId] = React.useState<string | null>(null);

  const materiasAprobadas = (datosPersonales.materiasAprobadas as string[] | undefined) || [];
  const materiasEspeciales = (datosPersonales.materiasEspeciales as string[] | undefined) || [];

  const creditosSeleccionados = useMemo(
    () => calcularCreditos(cargaAcademica, materias),
    [cargaAcademica, materias]
  );

  const especialesSeleccionadas = useMemo(
    () => cargaAcademica.filter(id => materiasEspeciales.includes(id)).length,
    [cargaAcademica, materiasEspeciales]
  );

  const bloqueadaPorMaxEspeciales = especialesSeleccionadas >= MAX_ESPECIALES;

  const verificarPrerequisitos = useCallback(
    (materia: Materia): { cumple: boolean; faltantes: string[] } => {
      const faltantes = materia.prerequisitos.filter(p => !materiasAprobadas.includes(p));
      return { cumple: faltantes.length === 0, faltantes };
    },
    [materiasAprobadas]
  );

  const disponibles = materias.filter(m => !cargaAcademica.includes(m.id));
  const seleccionadas = materias.filter(m => cargaAcademica.includes(m.id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setArrastrandoId(null);
    if (!over) return;

    const materiaId = active.id as string;
    const esEnCarga = cargaAcademica.includes(materiaId);

    if (over.id === 'zona-carga' && !esEnCarga) {
      const materia = materias.find(m => m.id === materiaId);
      if (!materia) return;
      const { cumple } = verificarPrerequisitos(materia);
      if (!cumple) return;
      if (bloqueadaPorMaxEspeciales && materiasEspeciales.includes(materiaId)) return;
      actualizarCargaAcademica([...cargaAcademica, materiaId]);
    } else if (over.id === 'zona-disponibles' && esEnCarga) {
      actualizarCargaAcademica(cargaAcademica.filter(id => id !== materiaId));
    }
  };

  const puedeAvanzar = creditosSeleccionados >= MIN_CREDITOS && creditosSeleccionados <= MAX_CREDITOS;

  const arrastrandoMateria = arrastrandoId ? materias.find(m => m.id === arrastrandoId) : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 5: Selección de Carga Académica</h2>
        <p className="text-gray-500 text-sm mt-1">Arrastra las materias para construir tu carga académica.</p>
      </div>

      <div className="flex items-center gap-4 bg-white border rounded-xl p-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Créditos seleccionados</span>
            <span className={`font-bold ${puedeAvanzar ? 'text-green-600' : 'text-red-600'}`}>
              {creditosSeleccionados} / {MAX_CREDITOS}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                creditosSeleccionados > MAX_CREDITOS
                  ? 'bg-red-500'
                  : creditosSeleccionados >= MIN_CREDITOS
                  ? 'bg-green-500'
                  : 'bg-yellow-400'
              }`}
              style={{ width: `${Math.min((creditosSeleccionados / MAX_CREDITOS) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Mínimo: {MIN_CREDITOS}</span>
            <span>Máximo: {MAX_CREDITOS}</span>
          </div>
        </div>
      </div>

      <DndContext
        onDragStart={e => setArrastrandoId(e.active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setArrastrandoId(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ZonaArrastreable id="zona-disponibles" className="border-2 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">
              📚 Disponibles ({disponibles.length})
            </h3>
            <div className="space-y-2 min-h-32">
              {disponibles.map(materia => {
                const { cumple, faltantes } = verificarPrerequisitos(materia);
                const esEspecial = materiasEspeciales.includes(materia.id);
                const bloqueada = !cumple || (bloqueadaPorMaxEspeciales && esEspecial);
                const razon = !cumple
                  ? `Prerequisitos faltantes: ${faltantes.join(', ')}`
                  : bloqueadaPorMaxEspeciales && esEspecial
                  ? 'Máximo de especiales alcanzado'
                  : undefined;
                return (
                  <TarjetaMateria
                    key={materia.id}
                    materia={materia}
                    bloqueada={bloqueada}
                    razonBloqueo={razon}
                  />
                );
              })}
              {disponibles.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Todas las materias están en tu carga</p>
              )}
            </div>
          </ZonaArrastreable>

          <ZonaArrastreable id="zona-carga" className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50/30">
            <h3 className="font-semibold text-blue-700 mb-3">
              📋 Mi Carga Académica ({seleccionadas.length} materias)
            </h3>
            <div className="space-y-2 min-h-32">
              {seleccionadas.map(materia => (
                <TarjetaMateria key={materia.id} materia={materia} enCarga={true} />
              ))}
              {seleccionadas.length === 0 && (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center text-blue-400 text-sm">
                  Arrastra materias aquí
                </div>
              )}
            </div>
          </ZonaArrastreable>
        </div>

        <DragOverlay>
          {arrastrandoMateria && (
            <div className="p-3 rounded-lg border-2 border-blue-500 bg-white shadow-xl opacity-90">
              <p className="font-semibold text-sm">{arrastrandoMateria.nombre}</p>
              <p className="text-xs text-gray-500">{arrastrandoMateria.creditos} créditos</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {!puedeAvanzar && creditosSeleccionados > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {creditosSeleccionados < MIN_CREDITOS
            ? `⚠️ Debes seleccionar al menos ${MIN_CREDITOS} créditos.`
            : `⚠️ No puedes superar ${MAX_CREDITOS} créditos.`}
        </div>
      )}

      <div className="flex justify-between">
        <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
        <BotonPaso onClick={siguientePaso} disabled={!puedeAvanzar}>Siguiente →</BotonPaso>
      </div>
    </div>
  );
};
