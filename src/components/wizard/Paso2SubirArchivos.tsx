import React from 'react';
import { useWizard } from '../../store/useWizard';
import { BotonPaso } from '../common/BotonPaso';

export const Paso2SubirArchivos: React.FC = () => {
  const { archivos, actualizarArchivos, siguientePaso, anteriorPaso } = useWizard();

  const handleFile = (tipo: 'cardex' | 'historial') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) actualizarArchivos({ [tipo]: file });
  };

  const puedeAvanzar = !!archivos.cardex && !!archivos.historial;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Paso 2: Subir Documentos</h2>
        <p className="text-gray-500 text-sm mt-1">Suba su Kardex y Historial Académico en formato PDF.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${archivos.cardex ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
          <div className="text-3xl mb-2">{archivos.cardex ? '✅' : '📄'}</div>
          <p className="font-medium text-gray-700">Kardex</p>
          {archivos.cardex ? (
            <p className="text-sm text-green-600 mt-1">{archivos.cardex.name}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Archivo PDF</p>
          )}
          <label className="mt-3 inline-block cursor-pointer">
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {archivos.cardex ? 'Cambiar' : 'Seleccionar'}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFile('cardex')}
              className="hidden"
            />
          </label>
        </div>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${archivos.historial ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
          <div className="text-3xl mb-2">{archivos.historial ? '✅' : '📋'}</div>
          <p className="font-medium text-gray-700">Historial Académico</p>
          {archivos.historial ? (
            <p className="text-sm text-green-600 mt-1">{archivos.historial.name}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Archivo PDF</p>
          )}
          <label className="mt-3 inline-block cursor-pointer">
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {archivos.historial ? 'Cambiar' : 'Seleccionar'}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFile('historial')}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="flex justify-between">
        <BotonPaso variante="secundario" onClick={anteriorPaso}>← Anterior</BotonPaso>
        <BotonPaso onClick={siguientePaso} disabled={!puedeAvanzar}>Siguiente →</BotonPaso>
      </div>
    </div>
  );
};
