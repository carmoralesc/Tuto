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
import { SubjectSelectionStep } from "@/features/student-wizard/components/SubjectSelectionStep";
import { SignatureStep } from "@/features/student-wizard/components/SignatureStep";
import { ConfirmationStep } from "@/features/student-wizard/components/ConfirmationStep";

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
