import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "../App";
import LoginPage from "@/pages/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  PersonalDataStep,
  FileUploadStep,
  FailedSubjectsStep,
  FailureReasonsStep,
  SubjectSelectionStep,
  SignatureStep,
  ConfirmationStep,
} from "@/features/student-wizard/components";
import TutorDashboardPage from "../pages/TutorDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/wizard/paso-1" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <TutorDashboardPage />
          </ProtectedRoute>
        ),
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
            element: <SubjectSelectionStep />,
          },
          {
            path: "paso-6",
            element: <SignatureStep />,
          },
          {
            path: "paso-7",
            element: <ConfirmationStep />,
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
