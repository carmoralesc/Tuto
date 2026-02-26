import { create } from 'zustand';
import type { Materia } from '../types';

const MATERIAS_MUESTRA: Materia[] = [
  { id: 'm1', codigo: 'MAT101', nombre: 'Cálculo I', creditos: 4, prerequisitos: [] },
  { id: 'm2', codigo: 'MAT102', nombre: 'Cálculo II', creditos: 4, prerequisitos: ['m1'] },
  { id: 'm3', codigo: 'FIS101', nombre: 'Física I', creditos: 4, prerequisitos: [] },
  { id: 'm4', codigo: 'FIS102', nombre: 'Física II', creditos: 4, prerequisitos: ['m3', 'm1'] },
  { id: 'm5', codigo: 'PRG101', nombre: 'Programación I', creditos: 3, prerequisitos: [] },
  { id: 'm6', codigo: 'PRG102', nombre: 'Programación II', creditos: 3, prerequisitos: ['m5'] },
  { id: 'm7', codigo: 'ALG101', nombre: 'Álgebra Lineal', creditos: 3, prerequisitos: [] },
  { id: 'm8', codigo: 'EST101', nombre: 'Estadística I', creditos: 3, prerequisitos: ['m1'] },
  { id: 'm9', codigo: 'BD101', nombre: 'Bases de Datos I', creditos: 3, prerequisitos: ['m6'] },
  { id: 'm10', codigo: 'SO101', nombre: 'Sistemas Operativos', creditos: 3, prerequisitos: ['m6'] },
  { id: 'm11', codigo: 'RED101', nombre: 'Redes I', creditos: 3, prerequisitos: ['m10'] },
  { id: 'm12', codigo: 'ING101', nombre: 'Ingeniería de Software', creditos: 4, prerequisitos: ['m6', 'm9'] },
];

interface MateriasState {
  materias: Materia[];
  getMateriaById: (id: string) => Materia | undefined;
}

export const useMaterias = create<MateriasState>((_set, get) => ({
  materias: MATERIAS_MUESTRA,
  getMateriaById: (id) => get().materias.find(m => m.id === id),
}));
