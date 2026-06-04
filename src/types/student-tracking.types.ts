export interface SemesterTracking {
    semester: number; // 1 al 12
    materiasReprobadas: number;
    actividades: string[]; // códigos de actividades (ej. "A1", "A2")
}

export interface TrackingTest5 {
    organizacion: number;
    tecnicasEstudio: number;
    motivacion: number;
    total: number;
}

export interface TrackingNecesidades {
    A: boolean;
    B: boolean;
    C: boolean;
    D: boolean;
    E: boolean;
    F: boolean;
    G: boolean;
    H: boolean;
    I: boolean;
    J: boolean;
}

export type Test1Value = 'A' | 'V' | 'K';
export type Test2Value = 'A' | 'R' | 'T' | 'P';
export type Test3Value = 'N1' | 'N2' | 'N3' | 'N4';
export type Test4Value = 'A' | 'NA';

export interface StudentTrackingData {
    studentId: string; // número de control
    fullName: string;
    promedioBachillerato: number; // P.B
    promedioExamenAdmision: number; // P.E.A

    // Detección de necesidades (A-J)
    necesidades: TrackingNecesidades;

    // Tests
    test1: Test1Value; // Representación favorita
    test2: Test2Value; // Estilo de aprendizaje
    test3: Test3Value; // Autoestima
    test4: Test4Value; // Asertividad
    test5: TrackingTest5; // Habilidades de estudio

    semestres: SemesterTracking[]; // índice 0 = semestre 1, etc.
}
