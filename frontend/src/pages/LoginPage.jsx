import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import { errorMessage } from "../lib/time";
import { GitHubIcon } from "../components/icons";

function LoginPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useUserId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      navigate("/home");
    }
  }, [userId, navigate]);

  async function handleLocalLogin(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/login/local", { username, password });
      const res = await api.get("/user");
      setUserId(res.data.userId);
      navigate("/home");
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGithubLogin() {
    window.location.href = "/api/login/github";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link to="/" className="font-display text-3xl tracking-tight mb-8">
        noodle<span className="text-acid">.</span>
      </Link>

      <div className="card w-full max-w-sm p-8 animate-fade-up">
        <h1 className="font-display text-2xl">Welcome back</h1>
        <p className="text-sm text-muted mt-1 mb-6">Grab your chopsticks, the feed is hot.</p>

        <button type="button" onClick={handleGithubLogin} className="btn w-full bg-text text-ink hover:bg-text/85">
          <GitHubIcon className="w-4 h-4" />
          Continue with GitHub
        </button>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-line" />
          <span className="text-[11px] uppercase tracking-widest text-muted">or</span>
          <span className="flex-1 h-px bg-line" />
        </div>

        <form onSubmit={handleLocalLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button type="submit" className="btn-acid w-full" disabled={isSubmitting}>
            {isSubmitting ? "Cooking…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          New here?{" "}
          <Link to="/register" className="text-acid hover:text-acid-dim">
            Join noodle
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
