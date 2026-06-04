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
  ProtectedStep,
} from "@/features/student-wizard/components";
import TutorDashboardPage from "../pages/TutorDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import StudentDashboard from "../pages/StudentDashboard";
import StudentTrackingPage from "../pages/StudentTrackingPage";
import TutorTrackingListPage from "../pages/TutorTrackingListPage";
import TutorTrackingPage from "../pages/TutorTrackingPage";
import { useAuthStore } from "@/stores/useAuthStore";

function RoleIndexRedirect() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === "tutor") {
    return <Navigate to="/dashboard" replace />;
  }
  if (user?.role === "student") {
    return <Navigate to="/inicio" replace />;
  }
  return <Navigate to="/login" replace />;
}

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
        element: <RoleIndexRedirect />,
      },
      {
        path: "inicio",
        element: (
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        ),
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
            element: (
              <ProtectedStep stepNumber={1}>
                <PersonalDataStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-2",
            element: (
              <ProtectedStep stepNumber={2}>
                <FileUploadStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-3",
            element: (
              <ProtectedStep stepNumber={3}>
                <FailedSubjectsStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-4",
            element: (
              <ProtectedStep stepNumber={4}>
                <FailureReasonsStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-5",
            element: (
              <ProtectedStep stepNumber={5}>
                <SubjectSelectionStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-6",
            element: (
              <ProtectedStep stepNumber={6}>
                <SignatureStep />
              </ProtectedStep>
            ),
          },
          {
            path: "paso-7",
            element: (
              <ProtectedStep stepNumber={7}>
                <ConfirmationStep />
              </ProtectedStep>
            ),
          },
        ],
      },
      {
        path: "estudiante/seguimiento",
        element: (
          <ProtectedRoute>
            <StudentTrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tutor/seguimiento",
        element: (
          <ProtectedRoute>
            <TutorTrackingListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tutor/seguimiento/:studentId",
        element: (
          <ProtectedRoute>
            <TutorTrackingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
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
