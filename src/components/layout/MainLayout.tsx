import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Contenido principal */}
      <main className="p-6">{children}</main>
    </div>
  );
};
