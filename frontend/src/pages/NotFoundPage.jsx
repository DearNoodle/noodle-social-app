import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl text-acid">404</p>
      <p className="font-display text-2xl mt-4">This noodle slipped off the fork.</p>
      <p className="text-sm text-muted mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/home" className="btn-acid mt-8">
        Back to the pot
      </Link>
    </div>
  );
}

export default NotFoundPage;
