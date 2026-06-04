import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardStore } from "@/stores/useWizardStore";

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
}

export function SignatureStep() {
  const { setSignature, setCurrentStep, markStepCompleted } = useWizardStore();
  const navigate = useNavigate();

  const [signatureText, setSignatureText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const captcha = useMemo(() => generateCaptcha(), []);

  const CONFIRMATION_PHRASE = "ENVIO AL TUTOR";

  const isSignatureValid =
    signatureText.trim().toLowerCase() === CONFIRMATION_PHRASE.toLowerCase();
  const isCaptchaValid = parseInt(captchaInput, 10) === captcha.answer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignatureValid) {
      setError(`Debes escribir exactamente: "${CONFIRMATION_PHRASE}"`);
      return;
    }
    if (!isCaptchaValid) {
      setError("El resultado del captcha es incorrecto.");
      return;
    }

    setSignature(signatureText.trim());
    markStepCompleted(6);
    setCurrentStep(7);
    navigate("/wizard/paso-7");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Firma de conformidad
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Para continuar, escribe la frase de aceptación y resuelve el captcha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Frase de confirmación */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Escribe exactamente:{" "}
            <span className="font-mono text-blue-700">
              {CONFIRMATION_PHRASE}
            </span>
          </label>
          <input
            type="text"
            value={signatureText}
            onChange={(e) => {
              setSignatureText(e.target.value);
              setError(null);
            }}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={CONFIRMATION_PHRASE}
          />
        </div>

        {/* Captcha simulado */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Verificación de seguridad
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="rounded bg-white px-4 py-2 text-lg font-bold text-gray-900 shadow-inner select-none">
              {captcha.question}
            </div>
            <input
              type="number"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
                setError(null);
              }}
              className="block w-24 rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="?"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Botones de navegación (temporal mientras no tengas el WizardLayout) */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate("/wizard/paso-5")}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Firmar y continuar
          </button>
        </div>
      </form>
    </div>
  );
}
