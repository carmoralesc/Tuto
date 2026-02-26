import { useState } from 'react';
import { PaginaEstudiante } from './pages/PaginaEstudiante';
import { PaginaTutor } from './pages/PaginaTutor';

type Vista = 'estudiante' | 'tutor';

function App() {
  const [vista, setVista] = useState<Vista>('tutor');

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-700">🎓 TutorIA</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setVista('tutor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                vista === 'tutor'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tutor
            </button>
            <button
              onClick={() => setVista('estudiante')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                vista === 'estudiante'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Estudiante
            </button>
          </div>
        </div>
      </nav>

      {vista === 'tutor' ? <PaginaTutor /> : <PaginaEstudiante />}
    </div>
  );
}

export default App;
