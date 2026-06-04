import { createPortal } from "react-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "@/stores/useWizardStore";
import { getSubjectByKey } from "@/data/subjects";
import { mockSubjects } from "@/mocks/subjects.mock";

type SubjectSummary = {
  key: string;
  id: string;
  code: string;
  name: string;
  credits: number;
};

export function ConfirmationStep() {
  const {
    personalData,
    uploadedCardex,
    uploadedBoleta,
    failedSubjects,
    selectedSubjects,
    signature,
    setCurrentStep,
    markStepCompleted,
    resetWizard,
  } = useWizardStore();
  const navigate = useNavigate();

  // Estados del modal: 'idle' | 'confirm' | 'success'
  const [modalState, setModalState] = useState<'idle' | 'confirm' | 'success'>('idle');

  const resolveSummary = (key: string): SubjectSummary => {
    const subject = getSubjectByKey(key);
    if (!subject) {
      const mock = mockSubjects.find((s) => s.code === key || s.id === key);
      if (mock) return { key, id: mock.id, code: mock.code, name: mock.name, credits: mock.credits };
      return { key, id: key, code: key, name: key, credits: 0 };
    }
    return { key, id: subject.id, code: subject.code, name: subject.name, credits: subject.credits };
  };

  const selectedSubjectsData = selectedSubjects.map(resolveSummary);
  const failedSubjectsData = failedSubjects.map(resolveSummary);
  const totalCredits = selectedSubjectsData.reduce((sum, s) => sum + s.credits, 0);

  // Paso 1: abrir modal de confirmación
  const handleFinalize = () => {
    setModalState('confirm');
  };

  // Paso 2: el usuario confirma → mostrar éxito
  const handleConfirm = () => {
    // Aquí iría el envío real al backend
    markStepCompleted(7);
    setModalState('success');
  };

  // Cerrar modal de éxito y volver al inicio
  const handleCloseSuccess = () => {
    setModalState('idle');
    resetWizard();
    navigate("/");
  };

  // Cancelar desde el modal de confirmación
  const handleCancel = () => {
    setModalState('idle');
  };

  const handlePrevious = () => {
    setCurrentStep(6);
    navigate("/wizard/paso-6");
  };

  const modal = modalState !== 'idle' ? createPortal(
    <div className="fixed inset-0 z-[9999] isolate flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-md animate-confirmation-fade-in" />

      {/* Modal de confirmación */}
      {modalState === 'confirm' && (
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-confirmation-pop">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">¿Estás seguro?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Una vez enviada, la propuesta será revisada por tu tutor.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Modal de éxito (con animación de pulso) */}
      {modalState === 'success' && (
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-confirmation-pop">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600 animate-confirmation-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">¡Carga enviada con éxito!</h3>
          <p className="mt-2 text-sm text-gray-600">
            Tu propuesta ha sido registrada y será revisada por tu tutor.
          </p>
          <button
            type="button"
            onClick={handleCloseSuccess}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>,
    document.body,
  ) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Confirma tu carga académica
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Revisa cuidadosamente toda la información antes de finalizar.
        </p>
      </div>

      {/* 1. Datos personales */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="font-semibold text-gray-900">Datos personales</h3>
        </div>
        <div className="px-5 py-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre:</span>
            <span className="font-medium text-gray-900">
              {personalData.firstName} {personalData.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Matrícula:</span>
            <span className="font-medium text-gray-900">{personalData.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Programa:</span>
            <span className="font-medium text-gray-900">{personalData.program}</span>
          </div>
        </div>
      </section>

      {/* 2. Documentos */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="font-semibold text-gray-900">Documentos</h3>
        </div>
        <div className="px-5 py-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Cardex:</span>
            <span className={`font-medium ${uploadedCardex ? "text-green-700" : "text-gray-400"}`}>
              {uploadedCardex ? uploadedCardex.name : "No subido"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Boleta:</span>
            <span className={`font-medium ${uploadedBoleta ? "text-green-700" : "text-gray-400"}`}>
              {uploadedBoleta ? uploadedBoleta.name : "No subida"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Materias reprobadas */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="font-semibold text-gray-900">Materias reprobadas</h3>
        </div>
        <div className="px-5 py-4">
          {failedSubjectsData.length === 0 ? (
            <p className="text-sm text-gray-500">No se detectaron materias reprobadas.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {failedSubjectsData.map((subject) => (
                <li key={subject.key} className="flex justify-between gap-4">
                  <span className="text-gray-800">
                    {subject.name} <span className="text-gray-500">({subject.code})</span>
                  </span>
                  <span className="text-red-600 font-medium">Reprobada</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 4. Materias seleccionadas */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="font-semibold text-gray-900">Carga propuesta</h3>
        </div>
        <div className="px-5 py-4 space-y-2 text-sm">
          {selectedSubjectsData.map((subject) => (
            <div key={subject.id} className="flex justify-between">
              <span className="text-gray-800">
                {subject.name} <span className="text-gray-500">({subject.code})</span>
              </span>
              <span className="font-medium text-gray-700">{subject.credits} créd.</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold">
            <span className="text-gray-900">Total de créditos</span>
            <span className="text-gray-900">{totalCredits}</span>
          </div>
        </div>
      </section>

      {/* 5. Firma */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <h3 className="font-semibold text-gray-900">Firma de aceptación</h3>
        </div>
        <div className="px-5 py-4 text-sm">
          <p className="text-gray-600">El estudiante firmó con la frase:</p>
          <p className="mt-1 font-mono text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
            {signature}
          </p>
        </div>
      </section>

      {/* Botones finales */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrevious}
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Finalizar envío
        </button>
      </div>

      {modal}
    </div>
  );
}