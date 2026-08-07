import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";

const FEATURES = [
  {
    num: "01",
    title: "Post with flavour",
    desc: "Share thoughts, stories and photos — one pot at a time.",
  },
  {
    num: "02",
    title: "Relax with the feed",
    desc: "Browse a calm, dark feed. Like and comment at your own pace.",
  },
  {
    num: "03",
    title: "Follow the herd",
    desc: "Find people, follow their noodles, stay in the loop.",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const { userId } = useUserId();

  useEffect(() => {
    if (userId) {
      navigate("/home");
    }
  }, [userId, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto w-full max-w-5xl px-4 h-16 flex items-center justify-between">
        <span className="font-display text-2xl tracking-tight">
          noodle<span className="text-acid">.</span>
        </span>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-acid">
            Join
          </Link>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 flex flex-col justify-center py-16">
        <div className="animate-fade-up">
          <p className="eyebrow text-acid">a social feed · served hot</p>
          <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] tracking-tight mt-6 max-w-2xl">
            The feed that's always{" "}
            <em className="italic text-acid">cooking</em>.
          </h1>
          <p className="text-muted text-lg mt-6 max-w-xl leading-relaxed">
            Noodle is a demo social network, served fresh. Post, like, comment, and follow. Pull up
            a chair — sign in with GitHub or a username and password.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-10">
            <Link to="/login" className="btn-acid text-base px-7 py-3">
              Get cooking
            </Link>
            <Link to="/register" className="btn-ghost text-base px-7 py-3">
              Create account
            </Link>
          </div>
          <p className="text-xs text-muted/70 mt-8">
            React · Express · Prisma · PostgreSQL · GitHub OAuth
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-20 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {FEATURES.map((f) => (
            <div key={f.num} className="card p-6">
              <p className="font-display text-3xl text-acid/80">{f.num}</p>
              <h3 className="font-display text-lg mt-4">{f.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        built by dearnoodle · a portfolio demo
      </footer>
    </div>
  );
}

export default LandingPage;
