// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MenuEditorPage from "./pages/MenuEditorPage";
import PublicMenuPage from "./pages/PublicMenuPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/menu" element={<MenuEditorPage />} />
        <Route path="/menu/:slug" element={<PublicMenuPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
