import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export const PageContainer = ({ children, title }: PageContainerProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      {children}
    </div>
  );
};
