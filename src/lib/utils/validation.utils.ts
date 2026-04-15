import type { Subject } from '@/types/subject.types';
import type { Student } from '@/types/student.types';

/**
 * Verifica si un estudiante cumple con los prerrequisitos de una materia.
 * @param student - Estudiante con historial académico
 * @param subject - Materia a validar
 * @returns true si cumple todos los prerrequisitos, false en caso contrario
 */
export function validatePrerequisites(student: Student, subject: Subject): boolean {
    const approvedSubjects = student.academicHistory
        .filter(record => record.status === 'approved')
        .map(record => record.subjectCode);

    return subject.prerequisites.every(prereq => approvedSubjects.includes(prereq));
}

/**
 * Calcula el total de créditos de una lista de materias seleccionadas.
 */
export function calculateTotalCredits(selectedSubjects: Subject[]): number {
    return selectedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
}

/**
 * Detecta violaciones en una carga académica propuesta.
 */
export interface ValidationViolation {
    type: 'credit-excess' | 'credit-deficit' | 'prerequisite-missing' | 'special-unauthorized';
    message: string;
    subjectCode?: string;
}

export function detectViolations(
    student: Student,
    selectedSubjects: Subject[],
    options?: { minCredits?: number; maxCredits?: number }
): ValidationViolation[] {
    const violations: ValidationViolation[] = [];
    const min = options?.minCredits ?? 20;
    const max = options?.maxCredits ?? 36;

    const totalCredits = calculateTotalCredits(selectedSubjects);

    if (totalCredits < min) {
        violations.push({
            type: 'credit-deficit',
            message: `Créditos insuficientes: ${totalCredits} (mínimo ${min})`,
        });
    }
    if (totalCredits > max) {
        violations.push({
            type: 'credit-excess',
            message: `Exceso de créditos: ${totalCredits} (máximo ${max})`,
        });
    }

    selectedSubjects.forEach(subject => {
        if (!validatePrerequisites(student, subject)) {
            violations.push({
                type: 'prerequisite-missing',
                message: `No cumple prerrequisitos para ${subject.name}`,
                subjectCode: subject.code,
            });
        }
        if (subject.isSpecial) {
            violations.push({
                type: 'special-unauthorized',
                message: `La materia ${subject.name} es especial y requiere autorización`,
                subjectCode: subject.code,
            });
        }
    });

    return violations;
}