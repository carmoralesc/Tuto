import React from 'react';
import { TablaTutor } from '../components/tutor/TablaTutor';

export const PaginaTutor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Tutoría Académica
          </h1>
          <p className="text-gray-500 mt-1">Panel del Tutor</p>
        </div>
        <TablaTutor />
      </div>
    </div>
  );
};
