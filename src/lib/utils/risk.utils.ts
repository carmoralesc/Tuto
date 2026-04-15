import type { Student } from '@/types/student.types';
import type { Subject } from '@/types/subject.types';

/**
 * Calcula un puntaje de riesgo académico (0-100).
 * Factores considerados:
 * - Promedio general
 * - Cantidad de materias reprobadas
 * - Repeticiones de materias
 * - Dificultad de la carga actual (créditos)
 */
export function calculateRiskScore(
    student: Student,
    selectedSubjects: Subject[]
): number {
    let score = 50; // Base neutral

    // Factor 1: Promedio (escala 0-100)
    const grades = student.academicHistory
        .filter(r => r.status === 'approved')
        .map(r => r.grade);
    const avg = grades.length > 0
        ? grades.reduce((a, b) => a + b, 0) / grades.length
        : 70; // sin historial, asumimos promedio regular

    score += (avg - 70) * 0.5; // Si avg=90 → +10 puntos; avg=50 → -10 puntos

    // Factor 2: Materias reprobadas (penalización por cada una)
    const failedCount = student.academicHistory.filter(r => r.status === 'failed').length;
    score -= failedCount * 5;

    // Factor 3: Repeticiones (más de un intento en la misma materia)
    const subjectAttempts = new Map<string, number>();
    student.academicHistory.forEach(r => {
        subjectAttempts.set(r.subjectCode, (subjectAttempts.get(r.subjectCode) || 0) + 1);
    });
    const repetitions = Array.from(subjectAttempts.values()).filter(count => count > 1).length;
    score -= repetitions * 8;

    // Factor 4: Carga actual (créditos vs histórico)
    const currentCredits = selectedSubjects.reduce((sum, s) => sum + s.credits, 0);
    const historicalMaxCredits = 30; // simplificación
    if (currentCredits > historicalMaxCredits) {
        score -= (currentCredits - historicalMaxCredits) * 2;
    }

    // Asegurar rango 0-100
    return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Clasifica el riesgo en categorías para UI.
 */
export function getRiskCategory(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'low';
    if (score >= 40) return 'medium';
    return 'high';
}