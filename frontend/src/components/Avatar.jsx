function Avatar({ user, className = "w-9 h-9" }) {
  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      <img
        src={user?.avatarUrl || undefined}
        alt={`${user?.username || "user"}'s avatar`}
        className="w-full h-full rounded-full object-cover bg-raised ring-1 ring-line"
        loading="lazy"
      />
    </span>
  );
}

export default Avatar;
