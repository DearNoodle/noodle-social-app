import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import { LogoutIcon } from "./icons";

function NavBar() {
  const navigate = useNavigate();
  const { setUserId } = useUserId();

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch {
      // session already gone — still navigate away
    }
    setUserId(null);
    navigate("/");
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "text-acid" : "text-muted hover:text-text"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/home" className="font-display text-xl tracking-tight">
          noodle<span className="text-acid">.</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/home" className={linkClass} end>
            Explore
          </NavLink>
          <NavLink to="/follows" className={linkClass}>
            Follows
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="w-8 h-8 rounded-lg bg-acid text-acid-ink font-display font-semibold flex items-center justify-center text-sm hover:bg-acid-dim transition-colors"
            title="Your profile"
          >
            n
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-raised transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
