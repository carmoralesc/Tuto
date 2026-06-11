export interface Canalizacion {
    primerSeguimiento: number[];   // códigos 1-5
    segundoSeguimiento: number[];
    tercerSeguimiento: number[];
    asistioPrimerSeguimiento: boolean;
    asistioSegundoSeguimiento: boolean;
    asistioTercerSeguimiento: boolean;
}

export interface StudentSemesterReport {
    studentId: string;
    studentName: string;
    sesionesGrupal: number;
    sesionesIndividual: number;
    canalizaciones: Canalizacion;
    observaciones: string;
    cambioTutor: boolean;
    cambioCarrera: boolean;
    cambioInstituto: boolean;
    cursosEspeciales: string[];
    repiteCursos: string[];
    totalMateriasReprobadas: number;
    promedioSemestral: number;
    boletaEntregada: boolean;
}

export interface SemesterReport {
    id: string;
    periodo: string;
    semestre: string;
    carrera: string;
    tutorName: string;
    fechaEntrega: string;
    totalTutoradosDesdePrimerSemestre: number;
    totalTutoradosEsteSemestre: number;
    estudiantes: StudentSemesterReport[];
}
