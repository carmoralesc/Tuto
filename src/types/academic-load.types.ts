import type { Subject } from './subject.types';

export interface AcademicLoadProposal {
    id: string;
    studentId: string;
    semester: string;        // Ej: "2026A"
    selectedSubjects: SelectedSubject[];
    status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
    submittedAt?: Date;
    tutorNotes?: string;
}

export interface SelectedSubject {
    subjectCode: string;
    isSpecialRequest: boolean; // Si el estudiante solicitó autorización especial
}

// Para el wizard, podemos tener un tipo extendido que incluya el objeto Subject completo
export interface SelectedSubjectWithDetails extends SelectedSubject {
    subject: Subject;
}