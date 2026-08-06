import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import NavBar from "../components/NavBar";
import Avatar from "../components/Avatar";
import { SearchIcon, ArrowIcon } from "../components/icons";

function UserRow({ user, index }) {
  return (
    <Link
      to={`/user/${user.id}`}
      className="card flex items-center gap-4 p-4 transition-all duration-150 hover:border-acid/50 hover:-translate-y-0.5 animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Avatar user={user} className="w-11 h-11" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{user.username}</p>
        <p className="text-xs text-muted truncate">{user.bio || "No bio yet."}</p>
      </div>
      <span className="btn-ghost !px-4 !py-2 text-xs">
        View <ArrowIcon className="w-3 h-3" />
      </span>
    </Link>
  );
}

function FollowsPage() {
  const navigate = useNavigate();
  const { userId } = useUserId();
  const [followedUsers, setFollowedUsers] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [searching, setSearching] = useState(false);

  async function fetchFollows() {
    const res = await api.get("/follows-page");
    setFollowedUsers(res.data);
  }

  async function handleSearch(event) {
    event.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) {
      setSearchedUsers(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const res = await api.get("/search/users", { params: { searchKeyword: keyword } });
    setSearchedUsers(res.data);
  }

  function clearSearch() {
    setSearchKeyword("");
    setSearchedUsers(null);
    setSearching(false);
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchFollows();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <form onSubmit={handleSearch} className="relative animate-fade-up">
          <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            className="input pl-11 pr-24"
            placeholder="Find fellow noodles…"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              if (!e.target.value) clearSearch();
            }}
          />
          {searching && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-text px-3 py-1.5"
            >
              clear
            </button>
          )}
        </form>

        <div>
          <p className="eyebrow mb-3">
            {searching ? `results for “${searchKeyword.trim()}”` : "your follows"}
          </p>

          {searching && searchedUsers?.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">Nobody found.</div>
          )}

          <div className="space-y-3">
            {(searching ? searchedUsers : followedUsers)?.map((user, i) => (
              <UserRow key={user.id} user={user} index={i} />
            ))}
          </div>

          {!searching && followedUsers?.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">
              You're not following anyone yet — try searching for someone above.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FollowsPage;
