import { useMemo } from 'react';
import { mockProposals } from '@/mocks/proposals.mock';
import { mockStudents } from '@/mocks/students.mock';
import { subjectsByCodeMap } from '@/data/subjects';
import { calculateRiskScore, getRiskCategory, detectViolations } from '@/lib/utils';
import { getNextAttemptLevel, getCategoryFromLevel } from '@/lib/utils/subject-level.utils';

interface ProposalDetailProps {
  proposalId: string;
}

export function ProposalDetail({ proposalId }: ProposalDetailProps) {
  const proposal = useMemo(() => mockProposals.find(p => p.id === proposalId), [proposalId]);
  const student = useMemo(() => proposal ? mockStudents.find(s => s.id === proposal.studentId) : undefined, [proposal]);

  const selectedSubjects = useMemo(() => {
    if (!proposal) return [];
    return proposal.selectedSubjects
      .map(sel => subjectsByCodeMap.get(sel.subjectCode))
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, [proposal]);

  const totalCredits = useMemo(() => selectedSubjects.reduce((sum, s) => sum + s.credits, 0), [selectedSubjects]);
  const riskScore = useMemo(() => student ? calculateRiskScore(student, selectedSubjects) : 0, [student, selectedSubjects]);
  const riskCategory = useMemo(() => getRiskCategory(riskScore), [riskScore]);
  const violations = useMemo(() => student ? detectViolations(student, selectedSubjects) : [], [student, selectedSubjects]);

  // Cursos especiales detectados
  const especialSubjects = useMemo(() => {
    if (!student) return [];
    return selectedSubjects.filter(subject => {
      const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
      const nextLevel = getNextAttemptLevel(attempts);
      return nextLevel === 5 || nextLevel === 6;
    });
  }, [student, selectedSubjects]);

  if (!proposal || !student) {
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
    approved: 'Aprobada',
    rejected: 'Rechazada',
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
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
          className={`self-start px-3 py-1 rounded-full text-sm font-medium ${proposal.status === 'submitted'
            ? 'bg-blue-100 text-blue-800'
            : proposal.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : proposal.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
        >
          {statusMap[proposal.status]}
        </span>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Créditos</p>
          <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Riesgo</p>
          <p
            className={`text-2xl font-bold ${riskCategory === 'high'
              ? 'text-red-600'
              : riskCategory === 'medium'
                ? 'text-yellow-600'
                : 'text-green-600'
              }`}
          >
            {riskScore}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Materias</p>
          <p className="text-2xl font-bold text-gray-900">{selectedSubjects.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Especiales</p>
          <p className="text-2xl font-bold text-purple-600">{especialSubjects.length}</p>
        </div>
      </div>

      {/* Lista de materias propuestas */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Materias propuestas</h3>
        <div className="space-y-3">
          {selectedSubjects.map(subject => {
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
                  <span className="font-medium text-gray-900">{subject.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{subject.code}</span>
                  {isRepite && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Repite
                    </span>
                  )}
                  {isEspecial && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                      Especial
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{subject.credits} créd.</span>
                </div>
              </div>
            );
          })}
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
            <span>Total de créditos</span>
            <span>{totalCredits}</span>
          </div>
        </div>
      </section>

      {/* Alertas automáticas */}
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

      {/* Acciones del tutor */}
      {proposal.status !== 'approved' && (
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Modificar carga
          </button>
          <button
            type="button"
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
          >
            Aprobar propuesta
          </button>
        </div>
      )}
    </div>
  );
}