import { create } from 'zustand';
import { Subject } from '../types/subject';
import { mockSubjects } from '../lib/mockData';

interface SubjectState {
  subjects: Subject[];
  getSubjectById: (id: string) => Subject | undefined;
}

export const useSubjectStore = create<SubjectState>()((_set, get) => ({
  subjects: mockSubjects,
  getSubjectById: (id: string) => get().subjects.find(s => s.id === id),
}));
