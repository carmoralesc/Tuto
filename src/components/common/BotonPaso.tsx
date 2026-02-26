import React from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  variante?: 'primario' | 'secundario' | 'peligro';
  children: React.ReactNode;
  tipo?: 'button' | 'submit';
  className?: string;
}

export const BotonPaso: React.FC<Props> = ({
  onClick,
  disabled = false,
  variante = 'primario',
  children,
  tipo = 'button',
  className = '',
}) => {
  const clases = {
    primario: 'bg-blue-600 hover:bg-blue-700 text-white',
    secundario: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    peligro: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${clases[variante]} ${className}`}
    >
      {children}
    </button>
  );
};
