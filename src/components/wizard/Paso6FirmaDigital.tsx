import React, { useState } from 'react';
import { useWizard } from '../../store/useWizard';
import { BotonPaso } from '../common/BotonPaso';

const FRASE_REQUERIDA = 'Acepto que la información proporcionada es verídica';

export const Paso6FirmaDigital: React.FC = () => {
  const { firmaDigital, actualizarFirma, siguientePaso, anteriorPaso } = useWizard();
  const [error, setError] = useState('');

  const handleContinuar = () => {
    if (firmaDigital.toLowerCase().trim() !== FRASE_REQUERIDA.toLowerCase()) {
      setError(`La frase no coincide. Escribe exactamente: "${FRASE_REQUERIDA}"`);
      return;
    }
    setError('');
    siguientePaso();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 6: Firma Digital</h2>
        <p className="text-gray-500 text-sm mt-1">Confirme su solicitud escribiendo la frase de verificación.</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
        <p className="text-sm text-gray-600">Para confirmar su solicitud, escriba exactamente la siguiente frase:</p>
        <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
          <p className="font-medium text-blue-800 text-lg">"{FRASE_REQUERIDA}"</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Su firma:</label>
          <input
            type="text"
            value={firmaDigital}
            onChange={e => {
              actualizarFirma(e.target.value);
              setError('');
            }}
            placeholder="Escriba la frase aquí..."
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
              error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
      <div className="flex justify-between">
        <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
        <BotonPaso onClick={handleContinuar}>Enviar Solicitud →</BotonPaso>
      </div>
    </div>
  );
};
