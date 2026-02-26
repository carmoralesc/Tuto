import React from 'react';
import { determinarNivelRiesgo, COLORES_RIESGO } from '../../utils/calcularRiesgo';
import type { NivelRiesgo } from '../../types';

interface Props {
  puntaje: number;
  mostrarTexto?: boolean;
}

const ETIQUETAS_RIESGO: Record<NivelRiesgo, string> = {
  ALTO: 'Alto',
  MEDIO: 'Medio',
  BAJO: 'Bajo',
};

export const IndicadorRiesgo: React.FC<Props> = ({ puntaje, mostrarTexto = false }) => {
  const nivel = determinarNivelRiesgo(puntaje);
  const color = COLORES_RIESGO[nivel];
  
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        title={`Riesgo ${ETIQUETAS_RIESGO[nivel]} (${puntaje} pts)`}
      />
      {mostrarTexto && (
        <span className="text-sm font-medium" style={{ color }}>
          {ETIQUETAS_RIESGO[nivel]}
        </span>
      )}
    </div>
  );
};
