import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserId } from "../lib/context";
import api from "../lib/api";
import Avatar from "../components/Avatar";
import { HeartIcon } from "../components/icons";
import { formatRelativeTime, errorMessage } from "../lib/time";

function PostPage() {
  const navigate = useNavigate();
  const { userId } = useUserId();
  const { id: postId } = useParams();

  const [postInfo, setPostInfo] = useState(null);
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    const res = await api.get(`/post-page/post/${postId}`);
    setPostInfo(res.data.postInfo);
    setLikeStatus(res.data.likeStatus);
  }

  async function handleToggleLike() {
    const wasLiked = likeStatus;
    setLikeStatus(!wasLiked);
    setLikeAnimating(true);
    setPostInfo((prev) =>
      prev ? { ...prev, _count: { ...prev._count, likedBy: prev._count.likedBy + (wasLiked ? -1 : 1) } } : prev
    );
    try {
      await api.put(`/like/post/${postId}`);
    } catch (err) {
      setLikeStatus(wasLiked);
      setPostInfo((prev) =>
        prev ? { ...prev, _count: { ...prev._count, likedBy: prev._count.likedBy + (wasLiked ? 1 : -1) } } : prev
      );
      setError(errorMessage(err, "Failed to like"));
    }
  }

  async function handleCreateComment(event) {
    event.preventDefault();
    if (!commentContent.trim()) return;
    setCommenting(true);
    try {
      await api.post(`/comment/post/${postId}`, { content: commentContent });
      setCommentContent("");
      await fetchData();
    } catch (err) {
      setError(errorMessage(err, "Failed to comment"));
    } finally {
      setCommenting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await api.delete(`/comment/${commentId}`);
      await fetchData();
    } catch (err) {
      setError(errorMessage(err, "Failed to delete comment"));
    }
  }

  async function handleDeletePost() {
    if (!window.confirm("Delete this post for good?")) return;
    try {
      await api.delete(`/post/${postId}`);
      navigate("/home");
    } catch (err) {
      setError(errorMessage(err, "Failed to delete post"));
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchData();
  }, [userId, postId, navigate]);

  if (!postInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="eyebrow animate-pulse">serving…</p>
      </div>
    );
  }

  const isAuthor = postInfo.author.id === userId;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-ink/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="link-soft text-sm">
            ← back to the pot
          </Link>
          {isAuthor && (
            <button onClick={handleDeletePost} className="btn-danger !px-4 !py-2 text-xs">
              Delete post
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="card p-6 sm:p-8 animate-fade-up">
          <div className="flex items-center gap-3">
            <Link to={`/user/${postInfo.author.id}`} className="flex items-center gap-3 group">
              <Avatar user={postInfo.author} className="w-11 h-11" />
              <div>
                <p className="font-semibold group-hover:text-acid transition-colors">
                  {postInfo.author.username}
                </p>
                <p className="text-xs text-muted">{formatRelativeTime(postInfo.createdAt)}</p>
              </div>
            </Link>
          </div>

          <h1 className="font-display text-3xl leading-tight mt-6">{postInfo.title}</h1>
          {postInfo.postImageUrl && (
            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <img src={postInfo.postImageUrl} alt="" className="w-full max-h-[480px] object-cover" />
            </div>
          )}
          <p className="text-[15px] text-text/85 leading-relaxed mt-5 whitespace-pre-wrap">
            {postInfo.content}
          </p>

          <div className="flex items-center gap-4 mt-6 pt-5 border-t border-line">
            <button
              onClick={handleToggleLike}
              className={`btn ${likeStatus ? "bg-acid/15 text-acid border border-acid/40" : "btn-ghost"}`}
            >
              <span className={likeAnimating ? "animate-pop" : ""} onAnimationEnd={() => setLikeAnimating(false)}>
                <HeartIcon filled={likeStatus} className="w-4 h-4" />
              </span>
              {postInfo._count.likedBy} {postInfo._count.likedBy === 1 ? "like" : "likes"}
            </button>
          </div>

          {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
        </article>

        <section className="mt-6 space-y-4">
          <form onSubmit={handleCreateComment} className="card p-5">
            <label htmlFor="comment" className="label">
              Add a comment
            </label>
            <textarea
              id="comment"
              className="input resize-none"
              rows={2}
              placeholder="Season it with a thought…"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button type="submit" className="btn-acid" disabled={commenting || !commentContent.trim()}>
                {commenting ? "Simmering…" : "Comment"}
              </button>
            </div>
          </form>

          <div>
            <p className="eyebrow mb-3">{postInfo.comments.length} comments</p>
            {postInfo.comments.length === 0 ? (
              <div className="card p-8 text-center text-sm text-muted">No comments yet. Be the first.</div>
            ) : (
              <div className="space-y-3">
                {postInfo.comments.map((comment) => (
                  <div key={comment.id} className="card p-4 flex gap-3 animate-fade-up">
                    <Avatar user={comment.user} className="w-9 h-9" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <Link to={`/user/${comment.user.id}`} className="text-sm font-semibold hover:text-acid transition-colors">
                          {comment.user.username}
                        </Link>
                        <span className="text-[11px] text-muted">{formatRelativeTime(comment.createdAt)}</span>
                        {comment.user.id === userId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="ml-auto text-[11px] text-muted hover:text-red-400 transition-colors"
                          >
                            delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-text/85 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default PostPage;
