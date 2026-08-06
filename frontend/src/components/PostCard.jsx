import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { formatRelativeTime } from "../lib/time";
import { ChatIcon, HeartIcon } from "./icons";

function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="card block p-5 transition-all duration-150 hover:border-acid/50 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_-12px_rgba(214,255,63,0.15)]"
    >
      <div className="flex items-center gap-3">
        <Avatar user={post.author} className="w-10 h-10" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{post.author.username}</p>
          <p className="text-xs text-muted">{formatRelativeTime(post.createdAt)}</p>
        </div>
      </div>

      <h3 className="font-display text-xl leading-snug mt-4">{post.title}</h3>
      <p className="text-sm text-muted mt-1.5 leading-relaxed line-clamp-4">{post.content}</p>

      {post.postImageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <img
            src={post.postImageUrl}
            alt=""
            className="w-full h-52 object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-line flex items-center gap-5 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon className="w-3.5 h-3.5" />
          {post._count?.likedBy ?? 0}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ChatIcon className="w-3.5 h-3.5" />
          {post._count?.comments ?? 0}
        </span>
      </div>
    </Link>
  );
}

export default PostCard;
