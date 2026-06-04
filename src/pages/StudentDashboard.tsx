import { Navigate, useNavigate } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/useAuthStore';

export default function StudentDashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'student') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    ¡Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                </h1>
                <p className="mt-2 text-gray-600">
                    Selecciona la acción que deseas realizar:
                </p>
            </div>

            <div className="grid grid-cols-1 max-w-md mx-auto gap-6">
                <button
                    type="button"
                    onClick={() => navigate('/wizard/paso-1')}
                    className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition hover:border-blue-400 hover:shadow-md"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition">
                        <AcademicCapIcon className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Realizar propuesta de carga académica
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Completa el wizard para proponer las materias del próximo semestre.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
