import { create } from 'zustand';
import type { Estudiante } from '../types';
import { calcularPuntajeRiesgo } from '../utils/calcularRiesgo';
import { useMaterias } from './useMaterias';

const ESTUDIANTES_MUESTRA: Estudiante[] = [
  {
    id: 'e1',
    nombre: 'Carlos',
    primerApellido: 'García',
    segundoApellido: 'López',
    semestre: 4,
    materiasAprobadas: ['m1', 'm3', 'm5', 'm7'],
    materiasReprobadas: ['m2'],
    materiasRepetidas: ['m2', 'm4'],
    materiasEspeciales: [],
    materiasPropuestas: ['m2', 'm4', 'm6', 'm8'],
    puntajeRiesgo: 0,
    estado: 'PENDIENTE',
  },
  {
    id: 'e2',
    nombre: 'Ana',
    primerApellido: 'Martínez',
    segundoApellido: 'Soto',
    semestre: 6,
    materiasAprobadas: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'],
    materiasReprobadas: [],
    materiasRepetidas: [],
    materiasEspeciales: ['m12'],
    materiasPropuestas: ['m8', 'm9', 'm10', 'm12'],
    puntajeRiesgo: 0,
    estado: 'MODIFICADO',
  },
  {
    id: 'e3',
    nombre: 'Luis',
    primerApellido: 'Rodríguez',
    segundoApellido: 'Pérez',
    semestre: 2,
    materiasAprobadas: [],
    materiasReprobadas: ['m1', 'm3'],
    materiasRepetidas: ['m1', 'm3', 'm5'],
    materiasEspeciales: ['m1', 'm3'],
    materiasPropuestas: ['m1', 'm3', 'm5', 'm7'],
    puntajeRiesgo: 0,
    estado: 'NO_ENTREGADO',
  },
  {
    id: 'e4',
    nombre: 'María',
    primerApellido: 'Hernández',
    segundoApellido: 'Vega',
    semestre: 8,
    materiasAprobadas: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'],
    materiasReprobadas: [],
    materiasRepetidas: [],
    materiasEspeciales: [],
    materiasPropuestas: ['m10', 'm11', 'm12'],
    puntajeRiesgo: 0,
    estado: 'APROBADO',
  },
];

interface EstudiantesState {
  estudiantes: Estudiante[];
  actualizarCarga: (estudianteId: string, materias: string[]) => void;
  actualizarEstado: (estudianteId: string, estado: Estudiante['estado']) => void;
  recalcularRiesgo: (estudianteId: string) => void;
}

export const useEstudiantes = create<EstudiantesState>((set, _get) => ({
  estudiantes: ESTUDIANTES_MUESTRA.map(e => ({
    ...e,
    puntajeRiesgo: calcularPuntajeRiesgo(e, useMaterias.getState().materias),
  })),
  actualizarCarga: (estudianteId, materias) => {
    set(state => ({
      estudiantes: state.estudiantes.map(e => {
        if (e.id !== estudianteId) return e;
        const updated = { ...e, materiasPropuestas: materias, estado: 'MODIFICADO' as const };
        return {
          ...updated,
          puntajeRiesgo: calcularPuntajeRiesgo(updated, useMaterias.getState().materias),
        };
      }),
    }));
  },
  actualizarEstado: (estudianteId, estado) => {
    set(state => ({
      estudiantes: state.estudiantes.map(e =>
        e.id === estudianteId ? { ...e, estado } : e
      ),
    }));
  },
  recalcularRiesgo: (estudianteId) => {
    set(state => ({
      estudiantes: state.estudiantes.map(e => {
        if (e.id !== estudianteId) return e;
        return {
          ...e,
          puntajeRiesgo: calcularPuntajeRiesgo(e, useMaterias.getState().materias),
        };
      }),
    }));
  },
}));
