import { create } from 'zustand';
import type { WizardState } from '../types';

interface WizardStore extends WizardState {
  irAPaso: (paso: number) => void;
  siguientePaso: () => void;
  anteriorPaso: () => void;
  actualizarDatosPersonales: (datos: Partial<WizardState['datosPersonales']>) => void;
  actualizarArchivos: (archivos: Partial<WizardState['archivos']>) => void;
  actualizarMateriasReprobadas: (materias: string[]) => void;
  actualizarRazones: (razones: WizardState['razones']) => void;
  actualizarCargaAcademica: (materias: string[]) => void;
  actualizarFirma: (firma: string) => void;
  reiniciar: () => void;
}

const ESTADO_INICIAL: WizardState = {
  paso: 1,
  datosPersonales: {},
  archivos: {},
  materiasReprobadas: [],
  razones: [],
  cargaAcademica: [],
  firmaDigital: '',
};

export const useWizard = create<WizardStore>((set) => ({
  ...ESTADO_INICIAL,
  irAPaso: (paso) => set({ paso }),
  siguientePaso: () => set(state => ({ paso: state.paso + 1 })),
  anteriorPaso: () => set(state => ({ paso: Math.max(1, state.paso - 1) })),
  actualizarDatosPersonales: (datos) =>
    set(state => ({ datosPersonales: { ...state.datosPersonales, ...datos } })),
  actualizarArchivos: (archivos) =>
    set(state => ({ archivos: { ...state.archivos, ...archivos } })),
  actualizarMateriasReprobadas: (materias) => set({ materiasReprobadas: materias }),
  actualizarRazones: (razones) => set({ razones }),
  actualizarCargaAcademica: (materias) => set({ cargaAcademica: materias }),
  actualizarFirma: (firma) => set({ firmaDigital: firma }),
  reiniciar: () => set(ESTADO_INICIAL),
}));
