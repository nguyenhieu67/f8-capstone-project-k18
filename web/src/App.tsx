import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { privateRoutes, publicRoutes } from "@/routes/routes";
import DefaultLayout from "@/layouts/DefaultLayout";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              const Layout = route.layout || DefaultLayout;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {privateRoutes.map((route, index) => {
              const Page = route.component;
              const Layout = route.layout || DefaultLayout;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
