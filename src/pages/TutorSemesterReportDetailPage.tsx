import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { StudentSemesterReportView } from '@/components/tutor/StudentSemesterReportView';

export default function TutorSemesterReportDetailPage() {
    const { user, isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'tutor') return <Navigate to="/dashboard" replace />;
    return <StudentSemesterReportView />;
}
