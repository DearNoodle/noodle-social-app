import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import NavBar from "../components/NavBar";
import PostCard from "../components/PostCard";
import { PlusIcon, SearchIcon } from "../components/icons";
import { errorMessage } from "../lib/time";

function HomePage() {
  const navigate = useNavigate();
  const { userId } = useUserId();

  const [posts, setPosts] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [composerError, setComposerError] = useState("");

  async function fetchPosts() {
    const res = await api.get("/home-page");
    setPosts(res.data);
  }

  async function handleSearch(event) {
    event.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const res = await api.get("/search/posts", { params: { searchKeyword: keyword } });
    setSearchResults(res.data);
  }

  function clearSearch() {
    setSearchKeyword("");
    setSearchResults(null);
    setSearching(false);
  }

  async function handlePublish(event) {
    event.preventDefault();
    setComposerError("");
    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await api.post("/post", formData);
      setTitle("");
      setContent("");
      setImageFile(null);
      await fetchPosts();
    } catch (err) {
      setComposerError(errorMessage(err, "Failed to publish"));
    } finally {
      setPublishing(false);
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchPosts();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <section className="card p-5 animate-fade-up">
          <form onSubmit={handlePublish}>
            <input
              type="text"
              className="input mb-3"
              placeholder="Title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
            <textarea
              className="input resize-none mb-3"
              rows={3}
              placeholder="What's cooking?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex items-center justify-between gap-3">
              <label className="btn-ghost cursor-pointer">
                <PlusIcon />
                {imageFile ? imageFile.name : "Add image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
              </label>
              <button type="submit" className="btn-acid" disabled={publishing}>
                {publishing ? "Cooking…" : "Publish"}
              </button>
            </div>
          </form>
          {composerError && <p className="text-sm text-red-400 mt-3">{composerError}</p>}
        </section>

        <form onSubmit={handleSearch} className="relative animate-fade-up" style={{ animationDelay: "60ms" }}>
          <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            className="input pl-11 pr-24"
            placeholder="Search the pot…"
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

        <div className="space-y-4">
          {searching && searchResults?.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">
              No noodles found for “{searchKeyword.trim()}”.
            </div>
          )}

          {!searching && posts?.length === 0 && (
            <div className="card p-8 text-center text-sm text-muted">
              The pot is empty — publish the first post.
            </div>
          )}

          {(searching ? searchResults : posts)?.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
