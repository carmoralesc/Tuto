import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { StudentTrackingForm } from '@/components/student/StudentTrackingForm';

export default function StudentTrackingPage() {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'student') {
        return <Navigate to="/dashboard" replace />;
    }

    return <StudentTrackingForm />;
}
