import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import StudentWizard from '../features/student/components/StudentWizard';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';

const StudentPage = React.memo(() => {
  const { currentStudent } = useStudentStore();
  const navigate = useNavigate();

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600 mb-4">No has seleccionado un estudiante.</p>
          <Button onClick={() => navigate('/')}>Ir al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portal del Estudiante</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, <span className="font-medium">{currentStudent.firstLastName} {currentStudent.secondLastName}</span>
          </p>
        </div>
        <StudentWizard />
      </main>
    </div>
  );
});

StudentPage.displayName = 'StudentPage';
export default StudentPage;
