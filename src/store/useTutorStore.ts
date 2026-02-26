import { create } from 'zustand';
import { Student } from '../types/student';
import { useStudentStore } from './useStudentStore';

interface TutorState {
  selectedStudent: Student | null;
  selectStudent: (student: Student | null) => void;
  approveStudent: (studentId: string) => void;
  modifyStudentLoad: (studentId: string) => void;
}

export const useTutorStore = create<TutorState>()((set) => ({
  selectedStudent: null,
  selectStudent: (student) => set({ selectedStudent: student }),
  approveStudent: (studentId) => {
    useStudentStore.getState().updateStudent({
      ...useStudentStore.getState().students.find((s) => s.id === studentId)!,
      status: 'APPROVED',
    });
    set((state) => ({
      selectedStudent:
        state.selectedStudent?.id === studentId
          ? { ...state.selectedStudent, status: 'APPROVED' }
          : state.selectedStudent,
    }));
  },
  modifyStudentLoad: (studentId) => {
    const student = useStudentStore.getState().students.find((s) => s.id === studentId);
    if (student) {
      useStudentStore.getState().updateStudent({ ...student, status: 'MODIFIED' });
    }
  },
}));
