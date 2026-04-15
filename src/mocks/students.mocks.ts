import type { Student } from '@/types/student.types';

export const mockStudents: Student[] = [
    {
        id: 's1',
        firstName: 'María',
        lastName: 'González',
        studentId: 'A00123456',
        enrolledProgram: 'Ingeniería en Sistemas Computacionales',
        academicHistory: [
            {
                subjectCode: 'MAT101',
                grade: 85,
                status: 'approved',
                attemptNumber: 1,
                semester: '2025A',
            },
            {
                subjectCode: 'FIS101',
                grade: 45,
                status: 'failed',
                attemptNumber: 1,
                semester: '2025A',
            },
            {
                subjectCode: 'PROG101',
                grade: 90,
                status: 'approved',
                attemptNumber: 1,
                semester: '2025A',
            },
            // MAT102 no la ha cursado aún
        ],
    },
];