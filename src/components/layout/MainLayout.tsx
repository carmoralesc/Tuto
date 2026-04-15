import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header provisional */}
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Sistema de Gestión Académica
        </h1>
      </header>

      {/* Contenido principal */}
      <main className="p-6">{children}</main>
    </div>
  );
};
