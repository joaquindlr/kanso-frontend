import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicRoute } from "./components/layout/PublicRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { appRoutes } from "./config/routes";
import { Suspense } from "react";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<PublicRoute />}>
        {appRoutes
          .filter((r) => r.isPublic)
          .map((r) => (
            <Route key={r.path} path={r.path} element={<r.component />} />
          ))}
      </Route>

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        {/* Rutas con MainLayout */}
        <Route element={<MainLayout />}>
          {appRoutes
            .filter((r) => !r.isPublic && !r.hideLayout)
            .map((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        Cargando...
                      </div>
                    }
                  >
                    <r.component />
                  </Suspense>
                }
              />
            ))}
        </Route>

        {/* Rutas sin MainLayout (si las hubiera en el futuro) */}
        {appRoutes
          .filter((r) => !r.isPublic && r.hideLayout)
          .map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      Cargando...
                    </div>
                  }
                >
                  <r.component />
                </Suspense>
              }
            />
          ))}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
