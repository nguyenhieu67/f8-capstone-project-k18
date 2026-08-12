import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes } from "@/routes/routes";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function App() {
  return (
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
        </Routes>
      </div>
    </Router>
  );
}
