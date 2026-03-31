import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TaskManagerPage from "./pages/TaskManagerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LandingPage from "./pages/LandingPage";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TaskManagerPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default App;
