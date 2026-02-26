import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = React.memo(() => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">SistemaTutoría</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Inicio
            </Link>
            <Link
              to="/estudiante"
              className={`text-sm font-medium transition-colors ${location.pathname === '/estudiante' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Estudiante
            </Link>
            <Link
              to="/tutor"
              className={`text-sm font-medium transition-colors ${location.pathname === '/tutor' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Tutor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
