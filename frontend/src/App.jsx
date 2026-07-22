import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardIndex from './pages/dashboard/DashboardIndex';
import EmployeesPage from './pages/employees/EmployeesPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import TasksPage from './pages/tasks/TasksPage';
import ReportsPage from './pages/reports/ReportsPage';

function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardIndex />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/tasks" element={<TasksPage />} />

                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
