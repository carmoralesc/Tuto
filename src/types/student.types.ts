export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;      // Num. de control
    enrolledProgram: string;
    academicHistory: AcademicRecord[];
}

export interface AcademicRecord {
    subjectCode: string;
    grade: number;           // Calificación (0-100)
    status: 'approved' | 'failed' | 'in-progress';
    attemptNumber: number;   // 1 = primera vez, 2 = repetición, etc.
    semester: string;        // Ej: "2025A"
}