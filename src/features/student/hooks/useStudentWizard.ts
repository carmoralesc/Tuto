import { useState, useCallback } from 'react';
import { Student, FailureReason } from '../../../types/student';

export const WIZARD_STEPS = [
  { label: 'Datos' },
  { label: 'Kardex' },
  { label: 'Reprobadas' },
  { label: 'Razones' },
  { label: 'Carga' },
  { label: 'Firma' },
  { label: 'Confirmar' },
  { label: 'Listo' },
];

interface WizardData {
  kardexFile: File | null;
  boletaFile: File | null;
  failureReasons: FailureReason[];
  signature: string;
}

interface UseStudentWizardReturn {
  currentStep: number;
  wizardData: WizardData;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
  setKardexFile: (file: File | null) => void;
  setBoletaFile: (file: File | null) => void;
  setFailureReason: (subjectId: string, reason: string) => void;
  setSignature: (sig: string) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export function useStudentWizard(_student: Student | null): UseStudentWizardReturn {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    kardexFile: null,
    boletaFile: null,
    failureReasons: [],
    signature: '',
  });

  const totalSteps = WIZARD_STEPS.length;

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const setKardexFile = useCallback((file: File | null) => {
    setWizardData((d) => ({ ...d, kardexFile: file }));
  }, []);

  const setBoletaFile = useCallback((file: File | null) => {
    setWizardData((d) => ({ ...d, boletaFile: file }));
  }, []);

  const setFailureReason = useCallback((subjectId: string, reason: string) => {
    setWizardData((d) => ({
      ...d,
      failureReasons: [
        ...d.failureReasons.filter((r) => r.subjectId !== subjectId),
        { subjectId, reason },
      ],
    }));
  }, []);

  const setSignature = useCallback((sig: string) => {
    setWizardData((d) => ({ ...d, signature: sig }));
  }, []);

  return {
    currentStep,
    wizardData,
    goNext,
    goBack,
    goToStep,
    setKardexFile,
    setBoletaFile,
    setFailureReason,
    setSignature,
    isLastStep: currentStep === totalSteps,
    isFirstStep: currentStep === 1,
  };
}
