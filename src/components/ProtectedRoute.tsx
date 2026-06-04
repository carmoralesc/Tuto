import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserRole } from '@/stores/useAuthStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: UserRole;
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRole && user?.role !== allowedRole) {
        if (user?.role === 'tutor') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/inicio" replace />;
    }

    return <>{children}</>;
}