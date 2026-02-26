import React from 'react';
import { WizardEstudiante } from '../components/wizard/WizardEstudiante';

export const PaginaEstudiante: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Tutoría Académica
          </h1>
          <p className="text-gray-500 mt-2">Portal del Estudiante</p>
        </div>
      </div>
      <WizardEstudiante />
    </div>
  );
};
