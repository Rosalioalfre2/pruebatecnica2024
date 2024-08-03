import { Routes, Route } from "react-router-dom";
import NotFound from "@/components/pages/NotFound";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import NoPrivateRoute from "@/components/Routes/NoPrivatesRoutes";

const AuthRouter = () => {
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <NoPrivateRoute>
              <SignInPage />
          </NoPrivateRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <NoPrivateRoute>
            <SignUpPage />
          </NoPrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AuthRouter;
