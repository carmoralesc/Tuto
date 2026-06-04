import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "@/stores/useWizardStore";
import { mockSubjects } from "@/mocks/subjects.mock";

const REASON_CATEGORIES = [
  { value: "personal", label: "Motivos personales" },
  { value: "salud", label: "Problemas de salud" },
  { value: "trabajo", label: "Carga laboral" },
  { value: "academico", label: "Dificultad académica" },
  { value: "otro", label: "Otro" },
] as const;

type ReasonCategory = (typeof REASON_CATEGORIES)[number]["value"];

type FailureReasonState = {
  category: ReasonCategory | "";
  description: string;
};

const isReasonCategory = (value: string): value is ReasonCategory => {
  return REASON_CATEGORIES.some((category) => category.value === value);
};

export function FailureReasonsStep() {
  const { failedSubjects, failureReasons, setFailureReason, setCurrentStep, markStepCompleted } =
    useWizardStore();
  const navigate = useNavigate();

  const [reasons, setReasons] = useState<Record<string, FailureReasonState>>(
    () => {
      const initial: Record<string, FailureReasonState> = {};
      failedSubjects.forEach((code) => {
        const existing = failureReasons[code];
        const categoryValue = existing?.category ?? "";
        initial[code] = {
          category: isReasonCategory(categoryValue) ? categoryValue : "",
          description: existing?.description ?? "",
        };
      });
      return initial;
    },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCategoryChange = (code: string, category: ReasonCategory) => {
    setReasons((prev) => ({ ...prev, [code]: { ...prev[code], category } }));
    setErrors((prev) => ({ ...prev, [code]: "" }));
  };

  const handleDescriptionChange = (code: string, description: string) => {
    setReasons((prev) => ({ ...prev, [code]: { ...prev[code], description } }));
    setErrors((prev) => ({ ...prev, [code]: "" }));
  };

  const isReasonComplete = (reason?: FailureReasonState) => {
    return Boolean(reason?.category && reason.description.trim());
  };

  const canProceed = failedSubjects.every((code) =>
    isReasonComplete(reasons[code]),
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    failedSubjects.forEach((code) => {
      const reason = reasons[code];

      if (!reason?.category && !reason?.description.trim()) {
        newErrors[code] =
          "Debes seleccionar un motivo y completar la descripción";
        return;
      }

      if (!reason?.category) {
        newErrors[code] = "Debes seleccionar un motivo";
        return;
      }

      if (!reason.description.trim()) {
        newErrors[code] = "La descripción adicional es obligatoria";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    failedSubjects.forEach((code) => {
      setFailureReason(code, reasons[code]);
    });
    markStepCompleted(4);
    setCurrentStep(5);
    navigate("/wizard/paso-5");
  };

  const getSubjectName = (code: string) => {
    return mockSubjects.find((s) => s.code === code)?.name || code;
  };

  if (failedSubjects.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Sin materias reprobadas
        </h2>
        <p className="text-gray-600">
          No hay materias reprobadas que justificar.
        </p>
        <button
          onClick={() => {
            markStepCompleted(4);
            setCurrentStep(5);
            navigate("/wizard/paso-5");
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Continuar al siguiente paso
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Motivos de reprobación
      </h2>
      <p className="text-gray-600">
        Para cada materia reprobada, indica el motivo principal. Esta
        información ayudará a tu tutor a entender tu situación.
      </p>

      <div className="space-y-6">
        {failedSubjects.map((code) => {
          const subjectName = getSubjectName(code);
          const reason = reasons[code] || { category: "", description: "" };
          const error = errors[code];

          return (
            <div
              key={code}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div className="mb-4">
                <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {code}
                </span>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {subjectName}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría del motivo *
                  </label>
                  <select
                    value={reason.category}
                    onChange={(e) =>
                      handleCategoryChange(
                        code,
                        e.target.value as ReasonCategory,
                      )
                    }
                    className={`w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  >
                    <option value="">Selecciona una opción</option>
                    {REASON_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción adicional *
                  </label>
                  <textarea
                    value={reason.description}
                    onChange={(e) =>
                      handleDescriptionChange(code, e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Explica brevemente la situación..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate("/wizard/paso-3")}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          type="submit"
          disabled={!canProceed}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
