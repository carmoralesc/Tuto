import React from 'react';
import { useWizard } from '../../store/useWizard';
import { BarraProgreso } from '../common/BarraProgreso';
import { Paso1DatosPersonales } from './Paso1DatosPersonales';
import { Paso2SubirArchivos } from './Paso2SubirArchivos';
import { Paso3MateriasReprobadas } from './Paso3MateriasReprobadas';
import { Paso4RazonesReprobacion } from './Paso4RazonesReprobacion';
import { Paso5CargaAcademica } from './Paso5CargaAcademica';
import { Paso6FirmaDigital } from './Paso6FirmaDigital';
import { Paso7Confirmacion } from './Paso7Confirmacion';

const ETIQUETAS_PASOS = [
  'Datos',
  'Documentos',
  'Reprobadas',
  'Razones',
  'Carga',
  'Firma',
  'Confirmación',
];

const COMPONENTES_PASOS: Record<number, React.FC> = {
  1: Paso1DatosPersonales,
  2: Paso2SubirArchivos,
  3: Paso3MateriasReprobadas,
  4: Paso4RazonesReprobacion,
  5: Paso5CargaAcademica,
  6: Paso6FirmaDigital,
  7: Paso7Confirmacion,
};

export const WizardEstudiante: React.FC = () => {
  const { paso } = useWizard();
  const ComponentePaso = COMPONENTES_PASOS[paso] || Paso1DatosPersonales;

  return (
    <div className="max-w-3xl mx-auto">
      {paso < 7 && (
        <div className="mb-8">
          <BarraProgreso
            pasoActual={paso}
            totalPasos={ETIQUETAS_PASOS.length}
            etiquetas={ETIQUETAS_PASOS}
          />
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <ComponentePaso />
      </div>
    </div>
  );
};
