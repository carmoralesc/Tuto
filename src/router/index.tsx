import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import StudentPage from '../pages/StudentPage';
import TutorPage from '../pages/TutorPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/estudiante', element: <StudentPage /> },
  { path: '/tutor', element: <TutorPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
