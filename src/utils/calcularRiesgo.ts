import type { Estudiante, Materia, NivelRiesgo } from '../types';

export function calcularPuntajeRiesgo(
  estudiante: Pick<Estudiante, 'materiasEspeciales' | 'materiasRepetidas' | 'materiasProguestas' | 'materiasAprobadas'>,
  todasMaterias: Materia[]
): number {
  let puntaje = 0;

  const numEspeciales = estudiante.materiasEspeciales.length;
  if (numEspeciales >= 2) puntaje += 50;
  else if (numEspeciales === 1) puntaje += 30;

  const numRepetidas = estudiante.materiasRepetidas.length;
  if (numRepetidas >= 3) puntaje += 25;
  else if (numRepetidas === 2) puntaje += 15;

  const creditos = calcularCreditos(estudiante.materiasProguestas, todasMaterias);
  if (creditos > 36) puntaje += 30;
  else if (creditos < 20) puntaje += 20;

  const violaciones = contarViolacionesPrerequisitos(estudiante, todasMaterias);
  puntaje += violaciones * 15;

  return puntaje;
}

export function calcularCreditos(materiaIds: string[], todasMaterias: Materia[]): number {
  return materiaIds.reduce((total, id) => {
    const materia = todasMaterias.find(m => m.id === id);
    return total + (materia?.creditos ?? 0);
  }, 0);
}

export function contarViolacionesPrerequisitos(
  estudiante: Pick<Estudiante, 'materiasAprobadas' | 'materiasProguestas'>,
  todasMaterias: Materia[]
): number {
  let violaciones = 0;
  for (const materiaId of estudiante.materiasProguestas) {
    const materia = todasMaterias.find(m => m.id === materiaId);
    if (!materia) continue;
    for (const prereqId of materia.prerequisitos) {
      if (!estudiante.materiasAprobadas.includes(prereqId)) {
        violaciones++;
      }
    }
  }
  return violaciones;
}

export function determinarNivelRiesgo(puntaje: number): NivelRiesgo {
  if (puntaje >= 70) return 'ALTO';
  if (puntaje >= 40) return 'MEDIO';
  return 'BAJO';
}

export const COLORES_RIESGO: Record<NivelRiesgo, string> = {
  ALTO: '#ef4444',
  MEDIO: '#f59e0b',
  BAJO: '#22c55e',
};
