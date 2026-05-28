import type { Student } from '@/types/student.types';

export const mockStudents: Student[] = [
    {
        id: 's1',
        firstName: 'María',
        lastName: 'González',
        studentId: 'A00123456',
        enrolledProgram: 'Ingeniería en Computación',
        academicHistory: [
            // MAT101: aprobó en ordinario - eval ord (nivel 1)
            {
                subjectCode: 'MAT101',
                level: 1,
                status: 'aprobado',
                grade: 85,
                semester: '2025A',
                source: 'cardex',
            },
            // FIS101: reprobó ordinario eval ord (nivel 1), luego reprobó segunda op (nivel 2)
            {
                subjectCode: 'FIS101',
                level: 1,
                status: 'reprobado',
                grade: 45,
                semester: '2025A',
                source: 'cardex',
            },
            {
                subjectCode: 'FIS101',
                level: 2,
                status: 'reprobado',
                grade: 50,
                semester: '2025A',
                source: 'cardex',
                failureReason: { category: 'academico', description: 'No entregó proyecto final' }
            },
            // PROG101: aprobó en primera
            {
                subjectCode: 'PROG101',
                level: 1,
                status: 'aprobado',
                grade: 90,
                semester: '2025A',
                source: 'cardex',
            },
            // MAT102: llegó a repite (nivel 3) y reprobó
            {
                subjectCode: 'MAT102',
                level: 1,
                status: 'reprobado',
                grade: 55,
                semester: '2025A',
                source: 'cardex',
            },
            {
                subjectCode: 'MAT102',
                level: 2,
                status: 'reprobado',
                grade: 58,
                semester: '2025A',
                source: 'cardex',
            },
            {
                subjectCode: 'MAT102',
                level: 3,
                status: 'reprobado',
                grade: 64,
                semester: '2025B',
                source: 'cardex',
                failureReason: { category: 'academico', description: 'Bajo desempeño en exámenes parciales' }
            },
            // QUI101: llegó a especial (nivel 5) y reprobó
            {
                subjectCode: 'QUI101',
                level: 1,
                status: 'reprobado',
                grade: 42,
                semester: '2024B',
                source: 'cardex',
            },
            {
                subjectCode: 'QUI101',
                level: 2,
                status: 'reprobado',
                grade: 51,
                semester: '2024B',
                source: 'cardex',
            },
            {
                subjectCode: 'QUI101',
                level: 3,
                status: 'reprobado',
                grade: 47,
                semester: '2025A',
                source: 'cardex',
            },
            {
                subjectCode: 'QUI101',
                level: 4,
                status: 'reprobado',
                grade: 53,
                semester: '2025A',
                source: 'cardex',
            },
            {
                subjectCode: 'QUI101',
                level: 5,
                status: 'reprobado',
                grade: 59,
                semester: '2025B',
                source: 'cardex',
                failureReason: { category: 'academico', description: 'No acreditó laboratorio' }
            },
        ],
    },
];