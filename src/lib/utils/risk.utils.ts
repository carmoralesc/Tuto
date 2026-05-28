import type { Student } from '@/types/student.types';
import type { Subject } from '@/types/subject.types';
import { getNextAttemptLevel, getCategoryFromLevel } from './subject-level.utils';

/**
 * Calcula el puntaje de riesgo académico (0-100) para una carga propuesta.
 */
export function calculateRiskScore(student: Student, selectedSubjects: Subject[]): number {
    let score = 0;

    let especialCount = 0;
    let repiteCount = 0;

    selectedSubjects.forEach(subject => {
        const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
        const nextLevel = getNextAttemptLevel(attempts);

        if (nextLevel !== null) {
            const category = getCategoryFromLevel(nextLevel);
            if (category === 'especial') especialCount++;
            else if (category === 'repite') repiteCount++;
        } else {
            const last = attempts[attempts.length - 1];
            if (last && last.level === 6 && last.status === 'reprobado') {
                especialCount += 2; // Penalización extra
            }
        }
    });

    // Aplicar ponderaciones según reglas dadas
    if (especialCount >= 2) score += 50;
    else if (especialCount === 1) score += 30;

    if (repiteCount >= 3) score += 25;
    else if (repiteCount === 2) score += 15;
    else if (repiteCount === 1) score += 5;

    // Factor créditos
    const totalCredits = selectedSubjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits > 36) score += 30;
    else if (totalCredits < 20) score += 20;

    // Factor seriación (cada violación suma 15)
    const approvedCodes = student.academicHistory
        .filter(a => a.status === 'aprobado')
        .map(a => a.subjectCode);

    selectedSubjects.forEach(subject => {
        const missingPrereq = subject.prerequisites.some(prereq => !approvedCodes.includes(prereq));
        if (missingPrereq) score += 15;
    });

    return Math.min(100, Math.max(0, score));
}

/**
 * Clasifica el riesgo en categorías para UI.
 */
export function getRiskCategory(score: number): 'low' | 'medium' | 'high' {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
}