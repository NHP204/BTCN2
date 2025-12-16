import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Heart } from "lucide-react";

export default function UserNav({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.username || "User";
  const displayEmail = user?.email || "No Email";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-4 pr-2 hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shadow-sm">
          {initial}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {displayName}
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {displayEmail}
            </p>
            {user?.role && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded uppercase">
                {user.role}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Link
              to="/profile"
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>

            <Link
              to="/favorites"
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={16} className="text-red-500" />
              My Favorites
            </Link>

            <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Settings size={16} />
              Settings
            </button>
          </div>

          <div className="mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
