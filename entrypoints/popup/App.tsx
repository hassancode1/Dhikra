import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./login-page";
import PrivateRoute from "@/routes/private-routes";
import PublicRoute from "@/routes/public-routes";
import RecordPage from "./record-sreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/record"
          element={
            <PrivateRoute>
              {" "}
              <RecordPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
      </Routes>
      {/* <RecordPage /> */}
    </>
  );
}

export default App;
