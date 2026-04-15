import { MainLayout } from "./components/layout/MainLayout";
import { PageContainer } from "./components/layout/PageContainer";

function App() {
  return (
    <MainLayout>
      <PageContainer title="Bienvenido">
        <p className="text-gray-600">
          El sistema está listo. Próximo paso: configurar rutas.
        </p>
      </PageContainer>
    </MainLayout>
  );
}

export default App;
