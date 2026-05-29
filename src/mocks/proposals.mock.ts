import type { AcademicLoadProposal } from '@/types/academic-load.types';

export const mockProposals: AcademicLoadProposal[] = [
    // s2 Luis Hernández – riesgo medio-alto, una materia en repetición (AEF-1041)
    {
        id: 'p1',
        studentId: 's2',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'AEF-1041' }, // Matemáticas Discretas (repetición, nivel 3)
            { subjectCode: 'SCH-1024' }, // Taller de Administración (4 créd)
            { subjectCode: 'ACC-0906' }, // Fundamentos de Investigación (4 créd)
            { subjectCode: 'AEC-1008' }, // Contabilidad Financiera (4 créd)
            { subjectCode: 'AEC-1058' }, // Química (4 créd)
            { subjectCode: 'ACF-0903' }, // Álgebra Lineal (5 créd)
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-01'),
    },
    // s3 Ana López – riesgo bajo, carga normal 36 créditos
    {
        id: 'p2',
        studentId: 's3',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' }, // Cálculo Integral (5)
            { subjectCode: 'AED-1286' }, // POO (5)
            { subjectCode: 'AEC-1008' }, // Contabilidad Financiera (4)
            { subjectCode: 'AEC-1058' }, // Química (4)
            { subjectCode: 'ACF-0903' }, // Álgebra Lineal (5)
            { subjectCode: 'AEF-1052' }, // Probabilidad y Estadística (5)
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-02'),
    },
    // s4 Carlos Ramírez – riesgo medio, una materia en repetición (ACF-0902) y otra con prerrequisito no cumplido (ACF-0904)
    {
        id: 'p3',
        studentId: 's4',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' }, // Cálculo Integral (nivel 3)
            { subjectCode: 'AED-1286' }, // POO (5)
            { subjectCode: 'ACF-0904' }, // Cálculo Vectorial (5) – prerrequisito: integral (no aprobada, pero el sistema lo marcará como violación)
            { subjectCode: 'AEC-1008' }, // Contabilidad (4)
            { subjectCode: 'AEF-1052' }, // Probabilidad (5)
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-03'),
    },
    // s5 Sofía Martínez – riesgo alto, un curso especial (AED-1128 nivel 5) y otra materia normal
    {
        id: 'p4',
        studentId: 's5',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'AED-1128' }, // Fundamentos de Programación (nivel 5)
            { subjectCode: 'ACF-0902' }, // Cálculo Integral (nivel 5)
            { subjectCode: 'SCH-1024' }, // Taller de Administración (4 créd)
            { subjectCode: 'ACC-0906' }, // Fundamentos de Investigación (4 créd)
            { subjectCode: 'AEC-1058' }, // Química (4 créd)
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-04'),
    },
    // s6 Jorge Díaz – máximo riesgo, dos materias en especial ya aprobadas; carga normal (solo materias nuevas)
    {
        id: 'p5',
        studentId: 's6',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' }, // Cálculo Integral (nivel 5)
            { subjectCode: 'AEF-1041' }, // Matemáticas Discretas (nivel 3)
            { subjectCode: 'ACA-0907' }, // Taller de Ética (4)
            { subjectCode: 'ACC-0906' }, // Fundamentos de Investigación (4)
            { subjectCode: 'SCH-1024' }, // Taller de Administración (4)
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-05'),
    },
    // s2 Luis Hernández – borrador vacío
    {
        id: 'p6',
        studentId: 's2',
        semester: '2026A',
        selectedSubjects: [],
        status: 'draft',
    },
    // s3 Ana López – propuesta ya aprobada (carga ligera)
    {
        id: 'p7',
        studentId: 's3',
        semester: '2025B',
        selectedSubjects: [
            { subjectCode: 'ACF-0901' },
            { subjectCode: 'AED-1128' },
        ],
        status: 'approved',
        submittedAt: new Date('2025-08-10'),
    },
    // s1 María González – propuesta rechazada
    {
        id: 'p8',
        studentId: 's1',
        semester: '2025B',
        selectedSubjects: [
            { subjectCode: 'AEF-1041' }, // Reprobada, intentó cursar de nuevo
        ],
        status: 'rejected',
        submittedAt: new Date('2025-08-12'),
    },
];