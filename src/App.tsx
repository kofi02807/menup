// src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MenuEditorPage from "./pages/MenuEditorPage";
import PublicMenuPage from "./pages/PublicMenuPage";

// super simple fake auth for now
const isLoggedIn = () => {
  return localStorage.getItem("authToken") !== null;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div>
      <NavBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <PrivateRoute>
                <MenuEditorPage />
              </PrivateRoute>
            }
          />

          <Route path="/menu/:restaurantId" element={<PublicMenuPage />} />

          {/* 404 */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
