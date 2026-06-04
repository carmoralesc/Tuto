import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    StudentTrackingData,
    SemesterTracking,
} from '@/types/student-tracking.types';

function makeSemesters(count: number): SemesterTracking[] {
    return Array.from({ length: count }, (_, i) => ({
        semester: i + 1,
        materiasReprobadas: 0,
        actividades: [],
    }));
}

const mockStudents: StudentTrackingData[] = [
    {
        studentId: 'A00123456',
        fullName: 'María González López',
        promedioBachillerato: 8.5,
        promedioExamenAdmision: 72,
        necesidades: { A: false, B: false, C: true, D: false, E: false, F: true, G: true, H: false, I: false, J: false },
        test1: 'V',
        test2: 'R',
        test3: 'N2',
        test4: 'A',
        test5: { organizacion: 7, tecnicasEstudio: 6, motivacion: 8, total: 21 },
        semestres: makeSemesters(4).map((s) => {
            if (s.semester === 1) return { ...s, materiasReprobadas: 1, actividades: ['A1'] };
            if (s.semester === 2) return { ...s, materiasReprobadas: 2, actividades: ['A1', 'A2'] };
            return s;
        }),
    },
    {
        studentId: 'A00123457',
        fullName: 'Luis Ángel Hernández García',
        promedioBachillerato: 7.8,
        promedioExamenAdmision: 65,
        necesidades: { A: false, B: true, C: true, D: true, E: false, F: false, G: true, H: true, I: true, J: false },
        test1: 'K',
        test2: 'P',
        test3: 'N3',
        test4: 'NA',
        test5: { organizacion: 4, tecnicasEstudio: 5, motivacion: 3, total: 12 },
        semestres: makeSemesters(3).map((s) => {
            if (s.semester === 1) return { ...s, materiasReprobadas: 2, actividades: ['A1'] };
            if (s.semester === 2) return { ...s, materiasReprobadas: 1, actividades: ['A1', 'A2'] };
            if (s.semester === 3) return { ...s, materiasReprobadas: 2, actividades: ['A1', 'A2', 'A3'] };
            return s;
        }),
    },
    {
        studentId: 'A00123458',
        fullName: 'Ana Cristina López Martínez',
        promedioBachillerato: 9.2,
        promedioExamenAdmision: 88,
        necesidades: { A: false, B: false, C: false, D: false, E: false, F: false, G: false, H: true, I: false, J: false },
        test1: 'A',
        test2: 'T',
        test3: 'N1',
        test4: 'A',
        test5: { organizacion: 9, tecnicasEstudio: 9, motivacion: 8, total: 26 },
        semestres: makeSemesters(4),
    },
    {
        studentId: 'A00123459',
        fullName: 'Carlos Eduardo Ramírez Hernández',
        promedioBachillerato: 6.5,
        promedioExamenAdmision: 55,
        necesidades: { A: true, B: true, C: true, D: true, E: true, F: true, G: true, H: true, I: true, J: false },
        test1: 'V',
        test2: 'A',
        test3: 'N4',
        test4: 'NA',
        test5: { organizacion: 2, tecnicasEstudio: 3, motivacion: 2, total: 7 },
        semestres: makeSemesters(4).map((s) => {
            if (s.semester === 1) return { ...s, materiasReprobadas: 3, actividades: ['A1'] };
            if (s.semester === 2) return { ...s, materiasReprobadas: 2, actividades: ['A1', 'A2'] };
            if (s.semester === 3) return { ...s, materiasReprobadas: 4, actividades: ['A1', 'A2', 'A3'] };
            if (s.semester === 4) return { ...s, materiasReprobadas: 1, actividades: ['A1'] };
            return s;
        }),
    },
    {
        studentId: 'A00123460',
        fullName: 'Sofía Alejandra Martínez Torres',
        promedioBachillerato: 7.2,
        promedioExamenAdmision: 60,
        necesidades: { A: false, B: false, C: true, D: false, E: false, F: true, G: true, H: false, I: true, J: false },
        test1: 'K',
        test2: 'R',
        test3: 'N3',
        test4: 'NA',
        test5: { organizacion: 5, tecnicasEstudio: 4, motivacion: 6, total: 15 },
        semestres: makeSemesters(2).map((s) => {
            if (s.semester === 1) return { ...s, materiasReprobadas: 3, actividades: ['A1'] };
            if (s.semester === 2) return { ...s, materiasReprobadas: 2, actividades: ['A1', 'A2'] };
            return s;
        }),
    },
    {
        studentId: 'A00123461',
        fullName: 'Jorge Alberto Díaz Ramírez',
        promedioBachillerato: 7.0,
        promedioExamenAdmision: 58,
        necesidades: { A: false, B: true, C: true, D: false, E: false, F: true, G: false, H: true, I: false, J: false },
        test1: 'A',
        test2: 'P',
        test3: 'N2',
        test4: 'A',
        test5: { organizacion: 6, tecnicasEstudio: 7, motivacion: 5, total: 18 },
        semestres: makeSemesters(1).map((s) => {
            if (s.semester === 1) return { ...s, materiasReprobadas: 2, actividades: ['A1'] };
            return s;
        }),
    },
    {
        studentId: 'A00123462',
        fullName: 'Fernanda Ortega Paredes',
        promedioBachillerato: 8.0,
        promedioExamenAdmision: 70,
        necesidades: { A: false, B: false, C: false, D: true, E: false, F: false, G: true, H: false, I: false, J: true },
        test1: 'V',
        test2: 'T',
        test3: 'N2',
        test4: 'A',
        test5: { organizacion: 8, tecnicasEstudio: 7, motivacion: 9, total: 24 },
        semestres: makeSemesters(3).map((s) => {
            if (s.semester === 2) return { ...s, materiasReprobadas: 1, actividades: ['A1', 'A2'] };
            return s;
        }),
    },
];

interface StudentTrackingState {
    trackingData: StudentTrackingData | null;
    allTrackingData: StudentTrackingData[];
    loadTrackingByStudentId: (id: string) => void;
    saveTrackingData: (data: StudentTrackingData) => void;
    updateSemester: (
        studentId: string,
        semesterIndex: number,
        data: Partial<SemesterTracking>,
    ) => void;
}

export const useStudentTrackingStore = create<StudentTrackingState>()(
    persist(
        (set) => ({
            trackingData: null,
            allTrackingData: mockStudents,

            loadTrackingByStudentId: (id: string) => {
                set((state) => {
                    const found = state.allTrackingData.find((d) => d.studentId === id) ?? null;
                    return { trackingData: found };
                });
            },

            saveTrackingData: (data: StudentTrackingData) => {
                set((state) => {
                    const idx = state.allTrackingData.findIndex(
                        (d) => d.studentId === data.studentId,
                    );
                    if (idx >= 0) {
                        const updated = [...state.allTrackingData];
                        updated[idx] = data;
                        return { allTrackingData: updated, trackingData: data };
                    }
                    return {
                        allTrackingData: [...state.allTrackingData, data],
                        trackingData: data,
                    };
                });
            },

            updateSemester: (
                studentId: string,
                semesterIndex: number,
                data: Partial<SemesterTracking>,
            ) => {
                set((state) => {
                    const updated = state.allTrackingData.map((d) => {
                        if (d.studentId !== studentId) return d;
                        const semestres = [...d.semestres];
                        if (semestres[semesterIndex]) {
                            semestres[semesterIndex] = {
                                ...semestres[semesterIndex],
                                ...data,
                            };
                        }
                        const newData = { ...d, semestres };
                        return newData;
                    });
                    const currentTracking =
                        updated.find((d) => d.studentId === studentId) ?? state.trackingData;
                    return {
                        allTrackingData: updated,
                        trackingData: currentTracking,
                    };
                });
            },
        }),
        { name: 'student-tracking-storage' },
    ),
);
