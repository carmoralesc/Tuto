// Actividades predefinidas por semestre según el formato oficial de Seguimiento Tutorial (Sábana)
export const SEMESTER_ACTIVITIES: Record<number, string[]> = {
    1: ['A1: Curso de inducción'],
    2: ['A1: Asesoría académica', 'A2: Taller de hábitos de estudio', 'A3: Plática motivacional'],
    3: ['A1: Taller de administración del tiempo', 'A2: Curso de regularización', 'A3: Asesoría académica', 'A4: Orientación vocacional', 'A5: Plática de superación personal'],
    4: ['A1: Taller de liderazgo', 'A2: Curso de comunicación efectiva', 'A3: Asesoría académica'],
};

// Solo códigos cortos (A1, A2, etc.) para la tabla
export const SEMESTER_ACTIVITY_CODES: Record<number, string[]> = {
    1: ['A1'],
    2: ['A1', 'A2', 'A3'],
    3: ['A1', 'A2', 'A3', 'A4', 'A5'],
    4: ['A1', 'A2', 'A3'],
};

// Nombres descriptivos de cada necesidad
export const NECESIDADES_LABELS: Record<string, string> = {
    A: 'A: Problemas de salud física',
    B: 'B: Problemas de salud mental / emocional',
    C: 'C: Problemas económicos',
    D: 'D: Problemas familiares',
    E: 'E: Problemas de vivienda / traslado',
    F: 'F: Dificultades de aprendizaje',
    G: 'G: Falta de hábitos de estudio',
    H: 'H: Problemas de adaptación',
    I: 'I: Baja autoestima / inseguridad',
    J: 'J: Otra situación personal',
};

export const TOTAL_SEMESTERS = 12;
