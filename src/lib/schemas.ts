import { z } from 'zod';

export const MateriaSchema = z.object({
  id: z.string(),
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  creditos: z.number().int().positive(),
  prerequisitos: z.array(z.string()),
});

export const EstudianteSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  primerApellido: z.string().min(1, 'El primer apellido es requerido'),
  segundoApellido: z.string().min(1, 'El segundo apellido es requerido'),
  semestre: z.number().int().min(1).max(10),
  materiasAprobadas: z.array(z.string()),
  materiasReprobadas: z.array(z.string()),
  materiasRepetidas: z.array(z.string()),
  materiasEspeciales: z.array(z.string()),
  materiasPropuestas: z.array(z.string()),
  puntajeRiesgo: z.number().min(0),
  estado: z.enum(['MODIFICADO', 'PENDIENTE', 'NO_ENTREGADO', 'APROBADO']),
});

export const FirmaDigitalSchema = z.object({
  frase: z.string().min(10, 'La frase debe tener al menos 10 caracteres'),
});
