import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { TutorTrackingList } from '@/components/tutor/TutorTrackingList';

export default function TutorTrackingListPage() {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'tutor') {
        return <Navigate to="/wizard/paso-1" replace />;
    }

    return <TutorTrackingList />;
}
