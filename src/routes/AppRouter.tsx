import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@/App";
import StudentWizardPage from "@/pages/StudentWizardPage";
import TutorDashboardPage from "@/pages/TutorDashboardPage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App contiene el MainLayout
    children: [
      {
        index: true,
        element: <StudentWizardPage />, // Página por defecto (por ahora)
      },
      {
        path: "dashboard",
        element: <TutorDashboardPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
