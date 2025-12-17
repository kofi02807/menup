// src/pages/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../Message";
import logo from "../assets/logo.png"; // <-- ADDED LOGO IMPORT

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    localStorage.setItem("authToken", "demo-token");
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">

            {/* LOGO SECTION */}
            <div className="text-center mb-3">
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "70px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
            </div>

            {/* TITLE */}
           

            <p className="text-center text-muted mb-4">
              Log in to manage your restaurant’s digital menu.
            </p>

            {error && <Message type="danger">{error}</Message>}

            <form onSubmit={handleSubmit} className="card card-body">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@restaurant.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Log In
              </button>

              <p className="mt-3 text-center small text-muted">
                Don’t have an account yet? You’ll be able to sign up soon.
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
