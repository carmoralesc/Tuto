import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "../App";
import TutorDashboardPage from "../pages/TutorDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import {
  PersonalDataStep,
  FileUploadStep,
  FailedSubjectsStep,
} from "@/features/student-wizard/components";
import { FailureReasonsStep } from "@/features/student-wizard/components/FailureReasonsStep";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/wizard/paso-1" replace />,
      },
      {
        path: "dashboard",
        element: <TutorDashboardPage />,
      },
      {
        path: "wizard",
        children: [
          {
            path: "paso-1",
            element: <PersonalDataStep />,
          },
          {
            path: "paso-2",
            element: <FileUploadStep />,
          },
          {
            path: "paso-3",
            element: <FailedSubjectsStep />,
          },
          {
            path: "paso-4",
            element: <FailureReasonsStep />,
          },
          {
            path: "paso-5",
            element: (
              <div>Paso 5 - Selección de materias (en construcción)</div>
            ),
          },
          {
            path: "paso-6",
            element: <div>Paso 6 - Firma (en construcción)</div>,
          },
          {
            path: "paso-7",
            element: <div>Paso 7 - Confirmación (en construcción)</div>,
          },
        ],
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
