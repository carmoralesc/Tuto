import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "@/stores/useWizardStore";
import { mockStudents } from "@/mocks/students.mocks";
import { mockSubjects } from "@/mocks/subjects.mocks";
import type { AcademicLevel } from "@/types/student.types";
import { getCategoryFromLevel } from "@/lib/utils";

interface FailedSubjectDetail {
  code: string;
  name: string;
  professor: string;
  failedGrade: number | null;
  maxLevelReached: AcademicLevel | null;
}

export function FailedSubjectsStep() {
  const { setFailedSubjects, setCurrentStep } = useWizardStore();
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [detectedSubjects, setDetectedSubjects] = useState<
    FailedSubjectDetail[]
  >([]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const student = mockStudents[0];

      const failedCodes = student.academicHistory
        .filter((attempt) => attempt.status === "reprobado")
        .map((attempt) => attempt.subjectCode);
      const uniqueFailedCodes = [...new Set(failedCodes)];

      const details: FailedSubjectDetail[] = uniqueFailedCodes.map((code) => {
        const subject = mockSubjects.find((s) => s.code === code);
        const attempts = student.academicHistory.filter(
          (a) => a.subjectCode === code,
        );
        const failedAttempts = attempts.filter((a) => a.status === "reprobado");
        const maxLevel =
          attempts.length > 0
            ? (Math.max(...attempts.map((a) => a.level)) as AcademicLevel)
            : null;
        const latestFailedAttempt =
          failedAttempts.length > 0
            ? failedAttempts.reduce((latest, current) =>
                current.level > latest.level ? current : latest,
              )
            : null;

        return {
          code,
          name: subject?.name || code,
          professor: subject?.professor || "No asignado",
          failedGrade: latestFailedAttempt?.grade ?? null,
          maxLevelReached: maxLevel,
        };
      });

      setDetectedSubjects(details);
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setFailedSubjects(detectedSubjects.map((d) => d.code));
    setCurrentStep(4);
    navigate("/wizard/paso-4");
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analizando documentos
        </h2>
        <div className="flex justify-center">
          <svg
            className="h-12 w-12 animate-spin text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-gray-600">Procesando Cardex y Boleta...</p>
        <p className="text-sm text-gray-500">Esto puede tomar unos segundos</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Materias reprobadas detectadas
      </h2>
      <p className="text-gray-600">
        Según tu historial académico, se detectaron las siguientes materias
        reprobadas:
      </p>

      {detectedSubjects.length === 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 font-medium text-green-800">
            ¡No se detectaron materias reprobadas!
          </p>
          <p className="text-sm text-green-700">
            Puedes continuar con tu propuesta de carga.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {detectedSubjects.map((subject) => {
            const category = subject.maxLevelReached
              ? getCategoryFromLevel(subject.maxLevelReached)
              : null;
            const isRepite = category === "repite";
            const isEspecial = category === "especial";

            return (
              <div
                key={subject.code}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {subject.code}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-gray-900">
                          {subject.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Prof. {subject.professor}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex flex-col items-end justify-center gap-2 self-center"> */}
                  {isRepite && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Repite
                    </span>
                  )}
                  {isEspecial && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Especial
                    </span>
                  )}
                  <span className="text-sm font-semibold text-red-600">
                    {subject.failedGrade !== null
                      ? `${subject.failedGrade}/100`
                      : "Sin calificación"}
                  </span>
                  {/* </div> */}
                </div>
              </div>
            );
          })}

          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="confirmFailed"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="confirmFailed" className="text-sm text-gray-700">
              Confirmo que estas son todas las materias que he reprobado.
              Entiendo que debo proporcionar un motivo para cada una en el
              siguiente paso.
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate("/wizard/paso-2")}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={detectedSubjects.length > 0 && !confirmed}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
