import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UserIdContext } from "./lib/context";
import api from "./lib/api";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FollowsPage from "./pages/FollowsPage";
import ProfilePage from "./pages/ProfilePage";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user")
      .then((res) => setUserId(res.data.userId))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-acid font-display text-2xl flex items-center justify-center text-acid-ink animate-pulse">
          n
        </div>
        <p className="eyebrow animate-pulse">boiling water…</p>
      </div>
    );
  }

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/follows" element={<FollowsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserIdContext.Provider>
  );
}

export default App;
