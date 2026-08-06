import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import NavBar from "../components/NavBar";
import { errorMessage } from "../lib/time";

function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = useUserId();
  const [profile, setProfile] = useState(null);
  const [bioInput, setBioInput] = useState("");
  const [bioSaving, setBioSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  async function fetchProfile() {
    const res = await api.get("/profile-page");
    setProfile(res.data);
    setBioInput(res.data.bio || "");
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.put("/profile/image", formData);
      await fetchProfile();
    } catch (err) {
      setError(errorMessage(err, "Failed to update image"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleBioSave(event) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setBioSaving(true);
    try {
      await api.put("/profile/bio", { bio: bioInput });
      setSaved(true);
      await fetchProfile();
    } catch (err) {
      setError(errorMessage(err, "Failed to update bio"));
    } finally {
      setBioSaving(false);
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [userId, navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="eyebrow animate-pulse">stirring…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 animate-fade-up">
          <div className="relative group">
            <img
              src={profile.avatarUrl}
              alt="Your avatar"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-line"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-acid cursor-pointer"
            >
              change
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-3xl">@{profile.username}</h1>
            <p className="text-sm text-muted mt-2">{profile.bio || "No bio yet."}</p>
            <Link className="text-xs text-muted hover:text-acid mt-3 inline-block transition-colors" to={`/user/${userId}`}>
              view my public page →
            </Link>
          </div>
        </section>

        <section className="card p-6 mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h2 className="font-display text-xl mb-4">About you</h2>
          <form onSubmit={handleBioSave} className="space-y-3">
            <label htmlFor="bio" className="label">
              Bio
            </label>
            <textarea
              id="bio"
              className="input resize-none"
              rows={3}
              placeholder="Tell the pot who you are…"
              value={bioInput}
              onChange={(e) => {
                setBioInput(e.target.value);
                setSaved(false);
              }}
              maxLength={160}
            />
            <div className="flex items-center gap-3 justify-end">
              {saved && <span className="text-xs text-acid">saved ✓</span>}
              <button type="submit" className="btn-acid" disabled={bioSaving}>
                {bioSaving ? "Saving…" : "Save bio"}
              </button>
            </div>
          </form>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
