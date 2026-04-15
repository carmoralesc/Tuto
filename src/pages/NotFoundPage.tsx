import { PageContainer } from "@/components/layout/PageContainer";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <PageContainer title="404 - Página no encontrada">
      <p className="text-gray-600 mb-4">La ruta solicitada no existe.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </PageContainer>
  );
}
