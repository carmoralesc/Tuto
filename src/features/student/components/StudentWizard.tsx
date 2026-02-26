import React, { useCallback, useMemo } from 'react';
import { useStudentWizard, WIZARD_STEPS } from '../hooks/useStudentWizard';
import { useStudentStore } from '../../../store/useStudentStore';
import { useSubjectStore } from '../../../store/useSubjectStore';
import { calculateRiskScore } from '../../../utils/riskCalculator';
import StepIndicator from '../../../components/ui/StepIndicator';
import Button from '../../../components/ui/Button';
import FileUpload from '../../../components/ui/FileUpload';
import WizardStep from './WizardStep';
import SubjectDndPanel from './SubjectDndPanel';
import Badge from '../../../components/ui/Badge';

const FAILURE_REASONS = [
  'Falta de tiempo',
  'Dificultad del tema',
  'Problemas personales',
  'Trabajo',
  'Otro',
];

const StudentWizard = React.memo(() => {
  const { currentStudent, updateStudent, submitProposal } = useStudentStore();
  const { subjects } = useSubjectStore();
  const {
    currentStep,
    wizardData,
    goNext,
    goBack,
    setKardexFile,
    setBoletaFile,
    setFailureReason,
    setSignature,
    isFirstStep,
  } = useStudentWizard(currentStudent);

  const handleProposedChange = useCallback((proposed: string[]) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, proposedSubjects: proposed };
    const riskScore = calculateRiskScore(updated, subjects);
    updateStudent({ ...updated, riskScore });
  }, [currentStudent, subjects, updateStudent]);

  const handleSubmit = useCallback(() => {
    if (!currentStudent) return;
    submitProposal(currentStudent.id);
    goNext();
  }, [currentStudent, submitProposal, goNext]);

  const canProceedStep2 = wizardData.kardexFile && wizardData.boletaFile;

  const canProceedStep4 = useMemo(() => {
    if (!currentStudent) return true;
    return currentStudent.failedSubjects.every(
      sid => wizardData.failureReasons.some(r => r.subjectId === sid)
    );
  }, [currentStudent, wizardData.failureReasons]);

  const canProceedStep5 = useMemo(() => {
    if (!currentStudent) return false;
    const proposed = currentStudent.proposedSubjects;
    if (proposed.length === 0) return false;
    const totalCredits = subjects
      .filter(s => proposed.includes(s.id))
      .reduce((sum, s) => sum + s.credits, 0);
    return totalCredits >= 20 && totalCredits <= 36;
  }, [currentStudent, subjects]);

  const canProceedStep6 = wizardData.signature.trim().length >= 10;

  if (!currentStudent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se ha seleccionado ningún estudiante.</p>
      </div>
    );
  }

  const proposedSubjectsDetails = subjects.filter(s => currentStudent.proposedSubjects.includes(s.id));
  const totalCredits = proposedSubjectsDetails.reduce((sum, s) => sum + s.credits, 0);

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name ?? id;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WizardStep title="Paso 1: Verificar Datos Personales">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">
                  {currentStudent.firstLastName} {currentStudent.secondLastName}, {currentStudent.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID de Estudiante</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">{currentStudent.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semestre</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">{currentStudent.semester}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Materias aprobadas</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">{currentStudent.approvedSubjects.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Materias reprobadas</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-900">{currentStudent.failedSubjects.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">Verifique que sus datos sean correctos antes de continuar.</p>
          </WizardStep>
        );

      case 2:
        return (
          <WizardStep title="Paso 2: Cargar Kardex y Boleta">
            <p className="text-sm text-gray-600 mb-6">Por favor sube tus documentos en formato PDF.</p>
            <div className="space-y-4">
              <FileUpload label="Kardex Académico (PDF)" onFileSelect={setKardexFile} selectedFile={wizardData.kardexFile} />
              <FileUpload label="Boleta de Calificaciones (PDF)" onFileSelect={setBoletaFile} selectedFile={wizardData.boletaFile} />
            </div>
            {!canProceedStep2 && (
              <p className="mt-3 text-sm text-amber-600">* Debes cargar ambos documentos para continuar.</p>
            )}
          </WizardStep>
        );

      case 3:
        return (
          <WizardStep title="Paso 3: Materias Reprobadas">
            <p className="text-sm text-gray-600 mb-4">Las siguientes materias fueron detectadas automáticamente como reprobadas:</p>
            {currentStudent.failedSubjects.length === 0 ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">¡No tienes materias reprobadas!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {currentStudent.failedSubjects.map(sid => (
                  <li key={sid} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800 font-medium">{getSubjectName(sid)}</span>
                  </li>
                ))}
              </ul>
            )}
          </WizardStep>
        );

      case 4:
        return (
          <WizardStep title="Paso 4: Razones de Reprobación">
            {currentStudent.failedSubjects.length === 0 ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">No hay materias reprobadas. Puedes continuar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Selecciona una razón para cada materia reprobada (obligatorio):</p>
                {currentStudent.failedSubjects.map(sid => {
                  const selectedReason = wizardData.failureReasons.find(r => r.subjectId === sid)?.reason;
                  return (
                    <div key={sid} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900 mb-2">{getSubjectName(sid)}</p>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedReason ?? ''}
                        onChange={(e) => setFailureReason(sid, e.target.value)}
                      >
                        <option value="">-- Selecciona una razón --</option>
                        {FAILURE_REASONS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
            {!canProceedStep4 && currentStudent.failedSubjects.length > 0 && (
              <p className="mt-3 text-sm text-amber-600">* Debes seleccionar una razón para cada materia reprobada.</p>
            )}
          </WizardStep>
        );

      case 5:
        return (
          <WizardStep title="Paso 5: Selección de Carga Académica">
            <p className="text-sm text-gray-600 mb-4">Arrastra las materias que deseas cursar. Mínimo 20 créditos, máximo 36.</p>
            <SubjectDndPanel
              allSubjects={subjects}
              approvedSubjects={currentStudent.approvedSubjects}
              proposedSubjects={currentStudent.proposedSubjects}
              specialSubjects={currentStudent.specialSubjects}
              onProposedChange={handleProposedChange}
            />
            {!canProceedStep5 && (
              <p className="mt-3 text-sm text-amber-600">
                * Debes seleccionar materias con entre 20 y 36 créditos para continuar. ({totalCredits} créditos seleccionados)
              </p>
            )}
          </WizardStep>
        );

      case 6:
        return (
          <WizardStep title="Paso 6: Firma Digital">
            <p className="text-sm text-gray-600 mb-4">Ingresa tu frase de firma digital para confirmar la solicitud.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frase de firma digital <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu frase de firma (mínimo 10 caracteres)"
                value={wizardData.signature}
                onChange={(e) => setSignature(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">{wizardData.signature.length}/10 caracteres mínimos</p>
            </div>
            {!canProceedStep6 && wizardData.signature.length > 0 && (
              <p className="mt-2 text-sm text-red-600">La firma debe tener al menos 10 caracteres.</p>
            )}
          </WizardStep>
        );

      case 7:
        return (
          <WizardStep title="Paso 7: Confirmación de Solicitud">
            <p className="text-sm text-gray-600 mb-4">Revisa el resumen de tu solicitud antes de enviar:</p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Datos del estudiante</h4>
                <p className="text-sm text-blue-800">{currentStudent.firstLastName} {currentStudent.secondLastName}, {currentStudent.name}</p>
                <p className="text-sm text-blue-800">Semestre: {currentStudent.semester}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Carga académica propuesta ({totalCredits} créditos)</h4>
                <ul className="space-y-1">
                  {proposedSubjectsDetails.map(s => (
                    <li key={s.id} className="flex justify-between text-sm">
                      <span>{s.code} - {s.name}</span>
                      <span className="text-gray-500">{s.credits} cr.</span>
                    </li>
                  ))}
                </ul>
              </div>
              {wizardData.failureReasons.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Razones de reprobación</h4>
                  {wizardData.failureReasons.map(r => (
                    <p key={r.subjectId} className="text-sm">
                      <span className="font-medium">{getSubjectName(r.subjectId)}:</span> {r.reason}
                    </p>
                  ))}
                </div>
              )}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-1">Firma digital</h4>
                <p className="text-sm text-green-800 font-mono">{wizardData.signature}</p>
              </div>
            </div>
          </WizardStep>
        );

      case 8:
        return (
          <WizardStep title="¡Solicitud Enviada Exitosamente!">
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
              <p className="text-gray-600 mb-1">Tu propuesta de carga académica ha sido enviada correctamente.</p>
              <p className="text-gray-600 mb-6">Tu tutor revisará tu solicitud y te notificará el resultado.</p>
              <Badge variant="pending">Estado: PENDIENTE</Badge>
            </div>
          </WizardStep>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2: return !!canProceedStep2;
      case 4: return canProceedStep4;
      case 5: return canProceedStep5;
      case 6: return canProceedStep6;
      default: return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />
      </div>

      {renderStep()}

      {currentStep < 8 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={isFirstStep}
          >
            ← Anterior
          </Button>
          {currentStep === 7 ? (
            <Button onClick={handleSubmit}>
              Enviar Solicitud ✓
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canProceed()}>
              Siguiente →
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

StudentWizard.displayName = 'StudentWizard';
export default StudentWizard;
