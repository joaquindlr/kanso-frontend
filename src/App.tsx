import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicRoute } from "./components/layout/PublicRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { useAuthSession } from "./hooks/useAuthSession";

function App() {
  useAuthSession();

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/projects"
            element={<div>Projects view coming soon</div>}
          />
          <Route path="/team" element={<div>Team view coming soon</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
