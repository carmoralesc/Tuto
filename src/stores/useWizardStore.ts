import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
    personalData: {
        firstName: string;
        lastName: string;
        studentId: string;
        program: string;
    };
    // Paso 2: Archivos (solo referencia)
    uploadedCardex: File | null;
    uploadedBoleta: File | null;
    // Paso 3: Materias reprobadas detectadas (mock)
    failedSubjects: string[];
    // Paso 4: Motivos de reprobación
    failureReasons: Record<string, { category: string; description?: string }>;
    // Paso 5: Materias seleccionadas (códigos)
    selectedSubjects: string[];
    // Paso 6: Firma
    signature: string;
    // Paso actual (1-7)
    currentStep: number;

    setPersonalData: (data: WizardState['personalData']) => void;
    setUploadedCardex: (file: File | null) => void;
    setUploadedBoleta: (file: File | null) => void;
    setFailedSubjects: (subjects: string[]) => void;
    setFailureReason: (subjectCode: string, reason: { category: string; description?: string }) => void;
    setSelectedSubjects: (subjects: string[]) => void;
    setSignature: (signature: string) => void;
    setCurrentStep: (step: number) => void;
    resetWizard: () => void;
}

// 2. Estado inicial
const initialState = {
    personalData: {
        firstName: '',
        lastName: '',
        studentId: '',
        program: '',
    },
    uploadedCardex: null,
    uploadedBoleta: null,
    failedSubjects: [],
    failureReasons: {},
    selectedSubjects: [],
    signature: '',
    currentStep: 1,
};

// 3. Crear store con persistencia en localStorage (opcional pero útil)
export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            ...initialState,
            setPersonalData: (data) => set({ personalData: data }),
            setUploadedCardex: (file) => set({ uploadedCardex: file }),
            setUploadedBoleta: (file) => set({ uploadedBoleta: file }),
            setFailedSubjects: (subjects) => set({ failedSubjects: subjects }),
            setFailureReason: (subjectCode, reason) =>
                set((state) => ({
                    failureReasons: { ...state.failureReasons, [subjectCode]: reason },
                })),
            setSelectedSubjects: (subjects) => set({ selectedSubjects: subjects }),
            setSignature: (signature) => set({ signature }),
            setCurrentStep: (step) => set({ currentStep: step }),
            resetWizard: () => set(initialState),
        }),
        { name: 'wizard-storage' }
    )
);