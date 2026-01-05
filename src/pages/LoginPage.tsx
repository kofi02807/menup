// src/pages/LoginPage.tsx

import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Message from "../Message";
import logo from "../assets/menuo-logo-zz-03.svg";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
      
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ REAL authenticated user session now exists
    navigate("/dashboard/menu");
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            {/* LOGO */}
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
                  required
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
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <p className="mt-3 text-center small text-muted">
                Don’t have an account?{" "}
                <Link to="/signup">Create one</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
