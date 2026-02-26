import React from 'react';
import Header from '../components/layout/Header';
import TutorDashboard from '../features/tutor/components/TutorDashboard';

const TutorPage = React.memo(() => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel del Tutor</h1>
          <p className="text-gray-600 mt-1">Gestión de carga académica de estudiantes asignados</p>
        </div>
        <TutorDashboard />
      </main>
    </div>
  );
});

TutorPage.displayName = 'TutorPage';
export default TutorPage;
