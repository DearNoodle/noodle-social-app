import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import { errorMessage } from "../lib/time";

function RegisterPage() {
  const navigate = useNavigate();
  const { userId } = useUserId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      navigate("/home");
    }
  }, [userId, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(errorMessage(err, "Registration failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link to="/" className="font-display text-3xl tracking-tight mb-8">
        noodle<span className="text-acid">.</span>
      </Link>

      <div className="card w-full max-w-sm p-8 animate-fade-up">
        <h1 className="font-display text-2xl">Join the pot</h1>
        <p className="text-sm text-muted mt-1 mb-6">A username and a password — that's it.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="3–10 characters"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={10}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button type="submit" className="btn-acid w-full" disabled={isSubmitting}>
            {isSubmitting ? "Mixing dough…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Already a noodle?{" "}
          <Link to="/login" className="text-acid hover:text-acid-dim">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
