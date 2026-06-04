import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { mockStudents } from '@/mocks/students.mock';
import { subjectsByCodeMap } from '@/data/subjects';
import { calculateRiskScore, getRiskCategory, detectViolations } from '@/lib/utils';
import { getNextAttemptLevel, getCategoryFromLevel } from '@/lib/utils/subject-level.utils';
import type { AcademicLoadProposal } from '@/types/academic-load.types';
import type { Subject } from '@/types/subject.types';

interface ProposalDetailProps {
  proposalId: string;
  proposal?: AcademicLoadProposal;
  previousProposal?: AcademicLoadProposal;
  onModify: (id: string) => void;
  onApprove: (id: string) => void;
  onBack: () => void;
}

function computeDelta(current: number, previous: number): { text: string; color: string } | null {
  if (current === previous) return null;
  const diff = current - previous;
  const sign = diff > 0 ? '+' : '';
  return { text: `${sign}${diff}`, color: 'text-gray-600' };
}

function getCreditDeltaColor(currentInRange: boolean, previousInRange: boolean): string {
  if (currentInRange && !previousInRange) return 'text-green-600';
  if (!currentInRange && previousInRange) return 'text-red-600';
  return 'text-gray-500';
}

export function ProposalDetail({ proposal, previousProposal, onModify, onApprove, onBack }: ProposalDetailProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);

  const prop = proposal || undefined;
  const student = useMemo(() => prop ? mockStudents.find(s => s.id === prop.studentId) : undefined, [prop]);

  const selectedSubjects = useMemo(() => {
    if (!prop) return [];
    return prop.selectedSubjects
      .map(sel => subjectsByCodeMap.get(sel.subjectCode))
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, [prop]);

  const totalCredits = useMemo(() => selectedSubjects.reduce((sum, s) => sum + s.credits, 0), [selectedSubjects]);
  const riskScore = useMemo(() => student ? calculateRiskScore(student, selectedSubjects) : 0, [student, selectedSubjects]);
  const riskCategory = useMemo(() => getRiskCategory(riskScore), [riskScore]);

  // ⚠️ IMPORTANTE: especialSubjects debe declararse antes de violations
  const especialSubjects = useMemo(() => {
    if (!student) return [];
    return selectedSubjects.filter(subject => {
      const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
      const nextLevel = getNextAttemptLevel(attempts);
      return nextLevel === 5 || nextLevel === 6;
    });
  }, [student, selectedSubjects]);

  const violations = useMemo(() => {
    if (!student) return [];
    const minCredits = especialSubjects.length > 0 ? 0 : 20;
    const maxCredits = especialSubjects.length > 0 ? 20 : 36;
    // Con 2 especiales, no se aplican límites de créditos (solo esas dos materias)
    if (especialSubjects.length === 2) {
      return detectViolations(student, selectedSubjects, { minCredits: 0, maxCredits: 999 });
    }
    return detectViolations(student, selectedSubjects, { minCredits, maxCredits });
  }, [student, selectedSubjects, especialSubjects.length]);

  const previousSubjects = useMemo(() => {
    if (!previousProposal) return [];
    return previousProposal.selectedSubjects
      .map(sel => subjectsByCodeMap.get(sel.subjectCode))
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, [previousProposal]);

  const previousTotalCredits = useMemo(() => previousSubjects.reduce((sum, s) => sum + s.credits, 0), [previousSubjects]);
  const previousRiskScore = useMemo(() => student ? calculateRiskScore(student, previousSubjects) : 0, [student, previousSubjects]);
  const previousSpecialCount = useMemo(() => {
    if (!student) return 0;
    return previousSubjects.filter(subject => {
      const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
      const nextLevel = getNextAttemptLevel(attempts);
      return nextLevel === 5 || nextLevel === 6;
    }).length;
  }, [student, previousSubjects]);

  const currentInRange = totalCredits >= 20 && totalCredits <= 36;
  const previousInRange = previousTotalCredits >= 20 && previousTotalCredits <= 36;

  const creditDelta = previousProposal ? computeDelta(totalCredits, previousTotalCredits) : null;
  const creditDeltaColor = creditDelta && previousProposal
    ? getCreditDeltaColor(currentInRange, previousInRange)
    : '';

  const riskDelta = previousProposal ? computeDelta(riskScore, previousRiskScore) : null;
  const riskDeltaColor = riskDelta
    ? (riskScore < previousRiskScore ? 'text-green-600' : riskScore > previousRiskScore ? 'text-red-600' : 'text-gray-500')
    : '';

  const subjectsDelta = previousProposal ? computeDelta(selectedSubjects.length, previousSubjects.length) : null;
  const subjectsDeltaColor = subjectsDelta ? 'text-gray-500' : '';

  const specialDelta = previousProposal ? computeDelta(especialSubjects.length, previousSpecialCount) : null;
  const specialDeltaColor = specialDelta
    ? (especialSubjects.length < previousSpecialCount ? 'text-green-600' : especialSubjects.length > previousSpecialCount ? 'text-red-600' : 'text-gray-500')
    : '';

  const renderMetricCard = (
    label: string,
    value: string | number,
    delta: { text: string; color: string } | null,
    valueClassName: string,
    deltaClassName: string,
  ) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-bold ${valueClassName}`}>{value}</span>
        {delta ? (
          <span className={`text-lg font-semibold ${deltaClassName}`}>{delta.text}</span>
        ) : (
          <span aria-hidden="true" className="text-lg font-semibold opacity-0">0</span>
        )}
      </div>
    </div>
  );

  if (!prop || !student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Propuesta no encontrada.</p>
      </div>
    );
  }

  const statusMap: Record<string, string> = {
    draft: 'Borrador',
    submitted: 'Enviada',
    'under-review': 'En revisión',
    reviewed: 'Revisada',
    approved: 'Aprobada',
    rejected: 'Rechazada',
  };

  const renderSubjects = (subjects: Subject[], isPrevious: boolean) => (
    <div className={`space-y-3 ${isPrevious ? 'opacity-60 text-sm' : ''}`}>
      {subjects.map(subject => {
        const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
        const nextLevel = getNextAttemptLevel(attempts);
        const category = nextLevel ? getCategoryFromLevel(nextLevel) : null;
        const isRepite = category === 'repite';
        const isEspecial = category === 'especial';

        return (
          <div
            key={subject.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <span className={`font-medium ${isPrevious ? 'text-gray-600' : 'text-gray-900'}`}>{subject.name}</span>
              <span className="ml-2 text-sm text-gray-500">{subject.code}</span>
            </div>
            <div className="flex items-center gap-2">
              {isRepite && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Repite
                </span>
              )}
              {isEspecial && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                  Especial
                </span>
              )}
              <span className="text-sm text-gray-600">{subject.credits} créd.</span>
            </div>
          </div>
        );
      })}
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
        <span>Total de créditos</span>
        <span>{subjects.reduce((sum, s) => sum + s.credits, 0)}</span>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-36">
      <div className="space-y-6 pt-4">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-sm text-gray-600">
              {student.studentId} — {student.enrolledProgram}
            </p>
          </div>
          <span
            className={`self-start px-3 py-1 rounded-full text-sm font-medium ${prop.status === 'submitted'
              ? 'bg-blue-100 text-blue-800'
              : prop.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : prop.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
          >
            {statusMap[prop.status]}
          </span>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderMetricCard('Créditos', totalCredits, creditDelta, 'text-gray-900', creditDeltaColor)}
          {renderMetricCard('Riesgo', riskScore, riskDelta, riskCategory === 'high' ? 'text-red-600' : riskCategory === 'medium' ? 'text-yellow-600' : 'text-green-600', riskDeltaColor)}
          {renderMetricCard('Materias', selectedSubjects.length, subjectsDelta, 'text-gray-900', subjectsDeltaColor)}
          {renderMetricCard('Especiales', especialSubjects.length, specialDelta, 'text-purple-600', specialDeltaColor)}
        </div>

        {/* Materias propuestas */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Materias propuestas</h3>
          {renderSubjects(selectedSubjects, false)}
        </section>

        {/* Propuesta original */}
        {previousProposal && previousSubjects.length > 0 && (
          <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Propuesta original del alumno</h3>
            {renderSubjects(previousSubjects, true)}
          </section>
        )}

        {/* Alertas */}
        {violations.length > 0 && (
          <section className="bg-red-50 rounded-2xl border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">Alertas detectadas</h3>
            <ul className="space-y-2">
              {violations.map((v, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="mt-0.5">⚠️</span>
                  <span>{v.message}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Barra de acciones flotante */}
      <div className="fixed inset-x-0 bottom-4 z-30 px-4 sm:px-6 pointer-events-none">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-3 pointer-events-auto">
          <div className="flex justify-between gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              ← Volver a la lista
            </button>
            {prop.status !== 'approved' && (
              <div className="flex gap-3">
                <button
                  onClick={() => onModify(prop.id)}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Modificar carga
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
                >
                  Aprobar propuesta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de aprobación */}
      {showApproveModal && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
            <h3 className="text-lg font-bold text-gray-900">¿Aprobar propuesta?</h3>
            <p className="mt-2 text-sm text-gray-600">Una vez aprobada, se notificará al alumno.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  onApprove(prop.id);
                }}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}