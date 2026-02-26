import React from 'react';

interface Props {
  pasoActual: number;
  totalPasos: number;
  etiquetas: string[];
}

export const BarraProgreso: React.FC<Props> = ({ pasoActual, totalPasos, etiquetas }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {etiquetas.map((etiqueta, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${index < etiquetas.length - 1 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                index + 1 < pasoActual
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : index + 1 === pasoActual
                  ? 'bg-white border-blue-600 text-blue-600'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {index + 1 < pasoActual ? '✓' : index + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center hidden sm:block ${
                index + 1 === pasoActual ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {etiqueta}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((pasoActual - 1) / (totalPasos - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
