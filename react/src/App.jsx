import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import PrivateRoute from "@/components/Routes/PrivateRoute";
import { Router } from "@/components/routes";
import AuthRouter from "./pages/authentication/Router";

import NotFound from "./components/pages/NotFound";
import ServerError from "./components/pages/ServerError";
import Unauthorized from "./components/pages/Unauthorized";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
                <PrivateRoute ruta="/authentication/sign-in">
                  <DashboardPage />
                </PrivateRoute>
            }
            index
          />
          <Route
            path="/*"
            element={
                <PrivateRoute>
                  <Routes>
                    <Route path="*" element={<Router />} />
                  </Routes>
                </PrivateRoute>
            }
          />
          <Route path="/authentication/*" element={<AuthRouter />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
