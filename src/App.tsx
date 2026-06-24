import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicRoute } from "./components/layout/PublicRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Epics } from "./pages/Epics";
import { useAuthSession } from "./hooks/useAuthSession";
import { Suspense, lazy } from "react";

const Whiteboard = lazy(() =>
  import("./pages/Whiteboard").then((module) => ({
    default: module.Whiteboard,
  })),
);

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
          <Route path="/proyects" element={<Projects />} />
          <Route path="/epics" element={<Epics />} />
          <Route
            path="/whiteboard"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    Cargando pizarra...
                  </div>
                }
              >
                <Whiteboard />
              </Suspense>
            }
          />
          <Route path="/team" element={<div>Team view coming soon</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
