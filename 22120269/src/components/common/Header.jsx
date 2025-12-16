import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Home, Sun, Moon, LogIn } from "lucide-react";
import UserNav from "@/layouts/UserNav";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (location.pathname === "/") setSearchTerm("");
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/search?q=${searchTerm}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col items-center pt-2">
      <div className="w-full max-w-300 bg-red-100 dark:bg-red-900/50 flex items-center justify-between px-4 py-3 rounded-t-sm transition-colors">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          &lt;22120269&gt;
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-xl text-red-900 dark:text-red-100 uppercase tracking-wide hidden md:block">
          Movies Info
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative flex items-center transition-colors shadow-inner"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            >
              {theme === "dark" ? (
                <Moon size={12} className="text-gray-800" />
              ) : (
                <Sun size={12} className="text-yellow-500" />
              )}
            </div>
          </button>

          {user ? (
            <UserNav user={user} onLogout={handleLogout} />
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </div>

      <div className="w-full max-w-300 bg-blue-100 dark:bg-blue-900/50 flex items-center justify-between px-4 py-2 rounded-b-sm mt-px transition-colors">
        <Link
          to="/"
          className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
        >
          <Home className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Link>
        <form
          onSubmit={handleSearch}
          className="flex gap-2 w-full max-w-md ml-2"
        >
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-1 text-sm bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
