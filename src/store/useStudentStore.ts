import { create } from 'zustand';
import { Student } from '../types/student';
import { mockStudents } from '../lib/mockData';

interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  setCurrentStudent: (student: Student) => void;
  updateStudent: (updated: Student) => void;
  addProposedSubject: (studentId: string, subjectId: string) => void;
  removeProposedSubject: (studentId: string, subjectId: string) => void;
  submitProposal: (studentId: string) => void;
}

export const useStudentStore = create<StudentState>()((set) => ({
  students: mockStudents,
  currentStudent: null,
  setCurrentStudent: (student) => set({ currentStudent: student }),
  updateStudent: (updated) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === updated.id ? updated : s)),
      currentStudent: state.currentStudent?.id === updated.id ? updated : state.currentStudent,
    })),
  addProposedSubject: (studentId, subjectId) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? { ...s, proposedSubjects: [...s.proposedSubjects, subjectId] }
          : s
      ),
      currentStudent:
        state.currentStudent?.id === studentId
          ? { ...state.currentStudent, proposedSubjects: [...state.currentStudent.proposedSubjects, subjectId] }
          : state.currentStudent,
    })),
  removeProposedSubject: (studentId, subjectId) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? { ...s, proposedSubjects: s.proposedSubjects.filter((id) => id !== subjectId) }
          : s
      ),
      currentStudent:
        state.currentStudent?.id === studentId
          ? { ...state.currentStudent, proposedSubjects: state.currentStudent.proposedSubjects.filter((id) => id !== subjectId) }
          : state.currentStudent,
    })),
  submitProposal: (studentId) =>
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, status: 'PENDING' } : s
      ),
    })),
}));
