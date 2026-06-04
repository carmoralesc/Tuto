import type { AcademicLoadProposal } from '@/types/academic-load.types';

export const mockProposals: AcademicLoadProposal[] = [
    // ========== RIESGO BAJO ==========
    // s3 Ana – impecable, carga normal de 33 créditos, todas materias nuevas sin repeticiones
    {
        id: 'p2',
        studentId: 's3',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' },
            { subjectCode: 'AED-1286' },
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
            { subjectCode: 'ACF-0903' },
            { subjectCode: 'AEF-1052' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-02'),
    },
    // s3 Ana – propuesta ya aprobada de 20 créditos (materias sin prerrequisitos incumplidos)
    {
        id: 'p7',
        studentId: 's3',
        semester: '2025B',
        selectedSubjects: [
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
            { subjectCode: 'ACF-0903' },
            { subjectCode: 'AEF-1052' },
        ],
        status: 'approved',
        submittedAt: new Date('2025-08-10'),
    },
    // s6 Jorge – máximo riesgo en historial pero carga nueva sin repeticiones (riesgo bajo)
    {
        id: 'p5',
        studentId: 's6',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0903' },
            { subjectCode: 'AEF-1041' },
            { subjectCode: 'ACA-0907' },
            { subjectCode: 'ACC-0906' },
            { subjectCode: 'SCH-1024' },
            { subjectCode: 'AEC-1008' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-05'),
    },

    // ========== RIESGO MEDIO ==========
    // s2 Luis – 1 repetición (AEF-1041), carga normal
    {
        id: 'p1',
        studentId: 's2',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'AEF-1041' },
            { subjectCode: 'SCH-1024' },
            { subjectCode: 'ACC-0906' },
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
            { subjectCode: 'ACF-0903' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-01'),
    },
    // s4 Carlos – 1 repetición (ACF-0902), 1 nueva (AED-1286), créditos normales
    {
        id: 'p3',
        studentId: 's4',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' },
            { subjectCode: 'AED-1286' },
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEF-1052' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-03'),
    },
    // s8 Ricardo – 3 repeticiones, créditos ligeramente altos (33)
    {
        id: 'p13',
        studentId: 's8',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' },
            { subjectCode: 'AED-1286' },
            { subjectCode: 'AEF-1052' },
            { subjectCode: 'ACF-0903' },
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-05-03'),
    },

    // ========== RIESGO ALTO ==========
    // s5 Sofía – 1 especial (AED-1128), 1 repetición (AEF-1041), créditos normales
    {
        id: 'p9',
        studentId: 's5',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'AED-1128' }, // especial
            { subjectCode: 'AEF-1041' }, // repetición
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
            { subjectCode: 'ACF-0903' },
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-06'),
    },
    // s5 Sofía – 1 especial + créditos excedidos (37 créditos) → alto riesgo
    {
        id: 'p11',
        studentId: 's5',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'AED-1128' }, // especial (5)
            { subjectCode: 'AEF-1041' }, // repetición (5)
            { subjectCode: 'AEC-1008' }, // 4
            { subjectCode: 'AEC-1058' }, // 4
            { subjectCode: 'ACF-0903' }, // 5
            { subjectCode: 'AEF-1052' }, // 5
            { subjectCode: 'ACC-0906' }, // 4
            { subjectCode: 'SCH-1024' }, // 4 → total 36? 5+5+4+4+5+5+4+4 = 36. Necesitamos >36, añadimos una más
            { subjectCode: 'ACA-0907' }, // 4 → total 40 créditos
        ],
        status: 'submitted',
        submittedAt: new Date('2026-04-08'),
        // Nota: esta propuesta excede el máximo de 36 créditos, lo que suma +30 al riesgo.
    },
    // s7 Fernanda – 2 especiales (solo esas dos materias) → riesgo base 50, sin otras violaciones
    {
        id: 'p12',
        studentId: 's7',
        semester: '2026A',
        selectedSubjects: [
            { subjectCode: 'ACF-0902' }, // especial
            { subjectCode: 'AED-1128' }, // especial
        ],
        status: 'submitted',
        submittedAt: new Date('2026-05-02'),
    },
    // s1 María – propuesta rechazada (varias materias, técnicamente válida pero rechazada por el tutor)
    {
        id: 'p8',
        studentId: 's1',
        semester: '2025B',
        selectedSubjects: [
            { subjectCode: 'AEF-1041' }, // repetición
            { subjectCode: 'ACF-0902' }, // nueva
            { subjectCode: 'AED-1286' }, // nueva
            { subjectCode: 'AEC-1008' },
            { subjectCode: 'AEC-1058' },
        ],
        status: 'rejected',
        submittedAt: new Date('2025-08-12'),
    },
    // s2 Luis – borrador (sin materias)
    {
        id: 'p6',
        studentId: 's2',
        semester: '2026A',
        selectedSubjects: [],
        status: 'draft',
    },
];