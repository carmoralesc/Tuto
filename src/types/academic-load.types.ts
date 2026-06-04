import type { Subject } from './subject.types';

export interface AcademicLoadProposal {
    id: string;
    studentId: string;
    semester: string;        // Ej: "2026A"
    selectedSubjects: SelectedSubject[];
    status: 'draft' | 'submitted' | 'reviewed' | 'under-review' | 'approved' | 'rejected';
    submittedAt?: Date;
    tutorNotes?: string;
}

export interface SelectedSubject {
    subjectCode: string;
}

// Para el wizard, podemos tener un tipo extendido que incluya el objeto Subject completo
export interface SelectedSubjectWithDetails extends SelectedSubject {
    subject: Subject;
}