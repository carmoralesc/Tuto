import React, { useState, useCallback, useMemo } from 'react';
import { useStudentStore } from '../../../store/useStudentStore';
import { useSubjectStore } from '../../../store/useSubjectStore';
import { useTutorStore } from '../../../store/useTutorStore';
import { Student, StudentStatus } from '../../../types/student';
import { calculateRiskScore, getRiskLevel } from '../../../utils/riskCalculator';
import StudentTable from './StudentTable';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const STATUS_LABELS: Record<StudentStatus, string> = {
  MODIFIED: 'Modificado',
  PENDING: 'Pendiente',
  NOT_SUBMITTED: 'No enviado',
  APPROVED: 'Aprobado',
};

const TutorDashboard = React.memo(() => {
  const { students } = useStudentStore();
  const { subjects } = useSubjectStore();
  const { approveStudent } = useTutorStore();

  const [detailsStudent, setDetailsStudent] = useState<Student | null>(null);
  const [alertsStudent, setAlertsStudent] = useState<Student | null>(null);
  const [reasonsStudent, setReasonsStudent] = useState<Student | null>(null);

  const handleViewDetails = useCallback((student: Student) => setDetailsStudent(student), []);
  const handleViewAlerts = useCallback((student: Student) => setAlertsStudent(student), []);
  const handleViewReasons = useCallback((student: Student) => setReasonsStudent(student), []);

  const handleApprove = useCallback((studentId: string) => {
    approveStudent(studentId);
  }, [approveStudent]);

  const getAlerts = useCallback((student: Student) => {
    const alerts: string[] = [];
    const score = calculateRiskScore(student, subjects);
    const level = getRiskLevel(score);
    if (level === 'HIGH') alerts.push('⚠️ Riesgo alto: Se recomienda revisión prioritaria.');
    if (student.specialSubjects.filter(id => student.proposedSubjects.includes(id)).length >= 2) {
      alerts.push('📌 Tiene 2 o más materias especiales seleccionadas.');
    }
    if (student.repeatedSubjects.length >= 3) {
      alerts.push('🔄 Tiene 3 o más materias repetidas.');
    }
    const proposed = subjects.filter(s => student.proposedSubjects.includes(s.id));
    const credits = proposed.reduce((sum, s) => sum + s.credits, 0);
    if (credits > 36) alerts.push('📚 Excede el máximo de 36 créditos.');
    if (credits > 0 && credits < 20) alerts.push('📚 No alcanza el mínimo de 20 créditos.');
    if (alerts.length === 0) alerts.push('✅ No se detectaron alertas para este estudiante.');
    return alerts;
  }, [subjects]);

  const getSubjectName = useCallback((id: string) => subjects.find(s => s.id === id)?.name ?? id, [subjects]);

  const stats = useMemo(() => ({
    total: students.length,
    pending: students.filter(s => s.status === 'PENDING').length,
    modified: students.filter(s => s.status === 'MODIFIED').length,
    approved: students.filter(s => s.status === 'APPROVED').length,
    highRisk: students.filter(s => getRiskLevel(s.riskScore) === 'HIGH').length,
  }), [students]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Pendientes', value: stats.pending, color: 'text-blue-600' },
          { label: 'Modificados', value: stats.modified, color: 'text-orange-600' },
          { label: 'Aprobados', value: stats.approved, color: 'text-green-600' },
          { label: 'Riesgo Alto', value: stats.highRisk, color: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <Card title="Lista de Estudiantes">
        <StudentTable
          students={students}
          subjects={subjects}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onViewAlerts={handleViewAlerts}
          onViewFailureReasons={handleViewReasons}
        />
      </Card>

      {/* Student Details Modal */}
      <Modal
        isOpen={!!detailsStudent}
        onClose={() => setDetailsStudent(null)}
        title={detailsStudent ? `Detalles: ${detailsStudent.firstLastName} ${detailsStudent.secondLastName}` : ''}
        size="lg"
      >
        {detailsStudent && (() => {
          const proposed = subjects.filter(s => detailsStudent.proposedSubjects.includes(s.id));
          const totalCredits = proposed.reduce((sum, s) => sum + s.credits, 0);
          const riskLevel = getRiskLevel(detailsStudent.riskScore);
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Nombre:</span> {detailsStudent.firstLastName} {detailsStudent.secondLastName}, {detailsStudent.name}</div>
                <div><span className="font-medium">Semestre:</span> {detailsStudent.semester}</div>
                <div><span className="font-medium">Estado:</span> <Badge variant={STATUS_BADGE_VARIANT[detailsStudent.status]}>{STATUS_LABELS[detailsStudent.status]}</Badge></div>
                <div className="flex items-center gap-2"><span className="font-medium">Riesgo:</span> <Badge variant={RISK_BADGE_VARIANT[riskLevel]}>{RISK_LABEL[riskLevel]}</Badge> <span className="text-gray-500">({detailsStudent.riskScore} pts)</span></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Carga propuesta ({totalCredits} créditos)</h4>
                <ul className="space-y-1">
                  {proposed.map(s => (
                    <li key={s.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span>{s.code} - {s.name}</span>
                      <span className="text-gray-500">{s.credits} cr.</span>
                    </li>
                  ))}
                  {proposed.length === 0 && <li className="text-sm text-gray-500">Sin materias propuestas.</li>}
                </ul>
              </div>
              {(detailsStudent.status === 'PENDING' || detailsStudent.status === 'MODIFIED') && (
                <Button onClick={() => { handleApprove(detailsStudent.id); setDetailsStudent(null); }}>
                  Aprobar solicitud
                </Button>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Alerts Modal */}
      <Modal
        isOpen={!!alertsStudent}
        onClose={() => setAlertsStudent(null)}
        title={alertsStudent ? `Alertas: ${alertsStudent.firstLastName} ${alertsStudent.secondLastName}` : ''}
      >
        {alertsStudent && (
          <ul className="space-y-2">
            {getAlerts(alertsStudent).map((alert, i) => (
              <li key={i} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{alert}</li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Failure Reasons Modal */}
      <Modal
        isOpen={!!reasonsStudent}
        onClose={() => setReasonsStudent(null)}
        title={reasonsStudent ? `Razones de reprobación: ${reasonsStudent.firstLastName}` : ''}
      >
        {reasonsStudent && (
          <div className="space-y-2">
            {reasonsStudent.failedSubjects.length === 0 ? (
              <p className="text-gray-500">No hay materias reprobadas.</p>
            ) : (
              reasonsStudent.failedSubjects.map(sid => (
                <div key={sid} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-900">{getSubjectName(sid)}</p>
                  <p className="text-sm text-red-700 mt-1">Razón no registrada en esta sesión.</p>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  );
});

const STATUS_BADGE_VARIANT: Record<StudentStatus, 'modified' | 'pending' | 'not_submitted' | 'approved'> = {
  MODIFIED: 'modified',
  PENDING: 'pending',
  NOT_SUBMITTED: 'not_submitted',
  APPROVED: 'approved',
};

const RISK_BADGE_VARIANT: Record<string, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const RISK_LABEL: Record<string, string> = {
  HIGH: 'Alto',
  MEDIUM: 'Medio',
  LOW: 'Bajo',
};

TutorDashboard.displayName = 'TutorDashboard';
export default TutorDashboard;
