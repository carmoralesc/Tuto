import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "@/stores/useWizardStore";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPE = "application/pdf";

type UploadType = "cardex" | "boleta";

export function FileUploadStep() {
  const {
    uploadedCardex,
    uploadedBoleta,
    setUploadedCardex,
    setUploadedBoleta,
    setCurrentStep,
  } = useWizardStore();
  const navigate = useNavigate();

  const [activeUpload, setActiveUpload] = useState<UploadType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Record<UploadType, string | null>>({
    cardex: null,
    boleta: null,
  });
  const [dragActive, setDragActive] = useState<Record<UploadType, boolean>>({
    cardex: false,
    boleta: false,
  });

  const cardexInputRef = useRef<HTMLInputElement>(null);
  const boletaInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== ALLOWED_TYPE) return "Solo se permiten archivos PDF.";
    if (file.size > MAX_FILE_SIZE) return "El archivo no debe superar los 5MB.";
    return null;
  };

  const simulateUpload = (type: UploadType, onComplete: () => void) => {
    setActiveUpload(type);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setActiveUpload(null);
          onComplete();
        }
        return next;
      });
    }, 150);
  };

  const handleFile = (file: File, type: UploadType) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError((prev) => ({ ...prev, [type]: validationError }));
      return;
    }
    setError((prev) => ({ ...prev, [type]: null }));
    simulateUpload(type, () => {
      if (type === "cardex") setUploadedCardex(file);
      else setUploadedBoleta(file);
    });
  };

  const handleDrag = (
    e: React.DragEvent,
    type: UploadType,
    isActive: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: isActive }));
  };

  const handleDrop = (e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, type);
  };

  const handleReset = (type: UploadType) => {
    if (type === "cardex") {
      setUploadedCardex(null);
      if (cardexInputRef.current) cardexInputRef.current.value = "";
    } else {
      setUploadedBoleta(null);
      if (boletaInputRef.current) boletaInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    setCurrentStep(3);
    navigate("/wizard/paso-3");
  };

  const bothFilesUploaded = uploadedCardex !== null && uploadedBoleta !== null;
  const isUploading = activeUpload !== null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Documentos académicos
      </h2>
      <p className="text-gray-600">
        Sube tu Cardex (historial oficial) y tu Boleta de calificaciones en
        formato PDF.
      </p>

      {/* Cardex */}
      <UploadSection
        type="cardex"
        title="Cardex (Oficial)"
        description="Documento oficial de control escolar."
        uploadedFile={uploadedCardex}
        error={error.cardex}
        dragActive={dragActive.cardex}
        isUploading={activeUpload === "cardex"}
        uploadProgress={activeUpload === "cardex" ? uploadProgress : 0}
        inputRef={cardexInputRef}
        onFileSelect={(file) => handleFile(file, "cardex")}
        onDrag={(e, active) => handleDrag(e, "cardex", active)}
        onDrop={(e) => handleDrop(e, "cardex")}
        onReset={() => handleReset("cardex")}
        disabled={isUploading}
      />

      {/* Boleta */}
      <UploadSection
        type="boleta"
        title="Boleta de calificaciones"
        description="Última boleta emitida (puede contener calificaciones recientes)."
        uploadedFile={uploadedBoleta}
        error={error.boleta}
        dragActive={dragActive.boleta}
        isUploading={activeUpload === "boleta"}
        uploadProgress={activeUpload === "boleta" ? uploadProgress : 0}
        inputRef={boletaInputRef}
        onFileSelect={(file) => handleFile(file, "boleta")}
        onDrag={(e, active) => handleDrag(e, "boleta", active)}
        onDrop={(e) => handleDrop(e, "boleta")}
        onReset={() => handleReset("boleta")}
        disabled={isUploading}
      />

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate("/wizard/paso-1")}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!bothFilesUploaded || isUploading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

interface UploadSectionProps {
  type: UploadType;
  title: string;
  description: string;
  uploadedFile: File | null;
  error: string | null;
  dragActive: boolean;
  isUploading: boolean;
  uploadProgress: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File) => void;
  onDrag: (e: React.DragEvent, active: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onReset: () => void;
  disabled: boolean;
}

function UploadSection({
  title,
  description,
  uploadedFile,
  error,
  dragActive,
  isUploading,
  uploadProgress,
  inputRef,
  onFileSelect,
  onDrag,
  onDrop,
  onReset,
  disabled,
}: UploadSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {!uploadedFile ? (
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={(e) => onDrag(e, true)}
          onDragLeave={(e) => onDrag(e, false)}
          onDragOver={(e) => onDrag(e, true)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <div className="space-y-2">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Arrastra o haz clic para subir PDF
            </p>
            <p className="text-xs text-gray-400">Máximo 5MB</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="h-8 w-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subiendo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
