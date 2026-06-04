import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { StudentTrackingView } from '@/components/tutor/StudentTrackingView';

export default function TutorTrackingPage() {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'tutor') {
        return <Navigate to="/wizard/paso-1" replace />;
    }

    return <StudentTrackingView />;
}
