import type { SubjectAttempt, AcademicLevel } from '@/types/student.types';

/**
 * Determina el nivel académico que tendría el próximo intento de una materia,
 * dado el historial de intentos previos.
 * 
 * @param attempts - Lista de intentos de UNA MISMA materia, ordenados cronológicamente.
 * @returns El nivel (1-6) del próximo intento, o null si ya no puede cursarse (baja definitiva o ya aprobada).
 */

export function getNextAttemptLevel(attempts: SubjectAttempt[]): AcademicLevel | null {
    // Si no hay intentos previos, empieza en nivel 1
    if (attempts.length === 0) return 1;

    // Ordenar por nivel (asumimos que ya vienen ordenados, pero por si acaso)
    const sorted = [...attempts].sort((a, b) => a.level - b.level);
    const last = sorted[sorted.length - 1];

    // Si el último intento fue aprobado, no se puede volver a cursar (al menos no en flujo normal)
    if (last.status === 'aprobado') return null;

    // Si está en curso, aún no se puede determinar el siguiente nivel
    if (last.status === 'en-curso') return null;

    // Reglas de transición según nivel reprobado
    switch (last.level) {
        case 1: return 2; // Ordinario eval ord -> Ordinario segunda op
        case 2: return 3; // Ordinario segunda op -> Repite eval ord
        case 3: return 4; // Repite eval ord -> Repite segunda op
        case 4: return 5; // Repite segunda op -> Especial eval ord
        case 5: return 6; // Especial eval ord -> Especial segunda op
        case 6: return null; // Especial segunda op -> BAJA DEFINITIVA
        default: return null;
    }
}

/**
 * Dado un nivel académico, retorna una descripción legible.
 */
export function getLevelDescription(level: AcademicLevel): string {
    const map: Record<AcademicLevel, string> = {
        1: 'Ordinario - Evaluación ordinaria',
        2: 'Ordinario - Segunda oportunidad',
        3: 'Repite - Evaluación ordinaria',
        4: 'Repite - Segunda oportunidad',
        5: 'Especial - Evaluación ordinaria',
        6: 'Especial - Segunda oportunidad',
    };
    return map[level];
}

/**
 * Retorna la categoría base (ordinario/repite/especial) a partir del nivel.
 */
export function getCategoryFromLevel(level: AcademicLevel): 'ordinario' | 'repite' | 'especial' {
    if (level === 1 || level === 2) return 'ordinario';
    if (level === 3 || level === 4) return 'repite';
    return 'especial';
}