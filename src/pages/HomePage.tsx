import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import Button from '../components/ui/Button';

const HomePage = React.memo(() => {
  const navigate = useNavigate();
  const { students, setCurrentStudent } = useStudentStore();

  const handleStudentLogin = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setCurrentStudent(student);
      navigate('/estudiante');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Tutoría Académica</h1>
        <p className="text-gray-600 text-lg">Gestión de carga académica para estudiantes y tutores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Soy Estudiante</h2>
          <p className="text-gray-600 text-sm mb-4">Propón tu carga académica y realiza el proceso de inscripción guiada.</p>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Selecciona tu cuenta:</p>
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => handleStudentLogin(s.id)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="font-medium text-gray-900">{s.firstLastName} {s.secondLastName}, {s.name}</span>
                <span className="block text-xs text-gray-500 mt-0.5">Semestre {s.semester}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Soy Tutor</h2>
          <p className="text-gray-600 text-sm mb-6">Revisa y gestiona las propuestas de carga académica de tus estudiantes asignados.</p>
          <Button className="w-full" onClick={() => navigate('/tutor')}>
            Acceder al Panel de Tutor
          </Button>
        </div>
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;
