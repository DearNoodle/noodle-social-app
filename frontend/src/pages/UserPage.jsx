import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import NavBar from "../components/NavBar";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import { errorMessage } from "../lib/time";

function UserPage() {
  const navigate = useNavigate();
  const { userId } = useUserId();
  const { id: pageUserId } = useParams();

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState(null);
  const [followStatus, setFollowStatus] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    const res = await api.get(`/user-page/user/${pageUserId}`);
    setUserInfo(res.data.userInfo);
    setPosts(res.data.posts || []);
    setFollowStatus(res.data.followStatus);
  }

  async function handleToggleFollow() {
    if (userId === pageUserId || followBusy) return;
    setFollowBusy(true);
    setFollowStatus(!followStatus);
    try {
      await api.put(`/follow/user/${pageUserId}`);
    } catch (err) {
      setFollowStatus(!followStatus);
      setError(errorMessage(err, "Failed to follow"));
    } finally {
      setFollowBusy(false);
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchData();
  }, [userId, pageUserId, navigate]);

  if (!userInfo) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="eyebrow animate-pulse">stirring…</p>
        </main>
      </div>
    );
  }

  const isSelf = userId === pageUserId;

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 animate-fade-up">
          <Avatar user={userInfo} className="w-28 h-28 !rounded-full" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-3xl">@{userInfo.username}</h1>
            <p className="text-sm text-muted mt-2">{userInfo.bio || "No bio yet."}</p>
            <p className="text-xs text-muted mt-3">
              {userInfo._count.followedBy} followers · {userInfo._count.posts} posts
            </p>
          </div>
          {!isSelf && (
            <button
              onClick={handleToggleFollow}
              className={followStatus ? "btn-ghost" : "btn-acid"}
              disabled={followBusy}
            >
              {followStatus ? "Unfollow" : "Follow"}
            </button>
          )}
        </section>

        {error && (
          <p className="text-sm text-red-400 mt-4 text-center">{error}</p>
        )}

        <div className="mt-8 space-y-4">
          <p className="eyebrow">{isSelf ? "your posts" : `${userInfo.username}'s posts`}</p>
          {posts?.length === 0 ? (
            <div className="card p-8 text-center text-sm text-muted">Nothing here yet.</div>
          ) : (
            posts?.map((post, i) => (
              <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default UserPage;
