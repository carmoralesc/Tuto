export type EstadoEstudiante = 'MODIFICADO' | 'PENDIENTE' | 'NO_ENTREGADO' | 'APROBADO';

export type NivelRiesgo = 'ALTO' | 'MEDIO' | 'BAJO';

export interface Materia {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  prerequisitos: string[];
}

export interface Estudiante {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  semestre: number;
  materiasAprobadas: string[];
  materiasReprobadas: string[];
  materiasRepetidas: string[];
  materiasEspeciales: string[];
  materiasPropuestas: string[];
  puntajeRiesgo: number;
  estado: EstadoEstudiante;
}

export interface RazonReprobacion {
  materiaId: string;
  razon: string;
}

export interface WizardState {
  paso: number;
  datosPersonales: Partial<Estudiante>;
  archivos: { cardex?: File; historial?: File };
  materiasReprobadas: string[];
  razones: RazonReprobacion[];
  cargaAcademica: string[];
  firmaDigital: string;
}
