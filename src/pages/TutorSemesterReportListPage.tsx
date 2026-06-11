import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { TutorSemesterReportList } from '@/components/tutor/TutorSemesterReportList';

export default function TutorSemesterReportListPage() {
    const { user, isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'tutor') return <Navigate to="/dashboard" replace />;
    return <TutorSemesterReportList />;
}
