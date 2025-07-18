import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { setToken, isAuthenticated } from "../../utils/auth";
import { AuthContext } from "../../context/AuthContext";
import jwtDecode from "jwt-decode";
import API from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoLoginData = location.state;
  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState(autoLoginData?.email || "");
  const [password, setPassword] = useState(autoLoginData?.password || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (autoLoginData?.email && autoLoginData?.password) {
      handleSubmit();
    }
  }, [autoLoginData]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      setToken(token);
      setAuth(jwtDecode(token));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center transition-all">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-2">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}