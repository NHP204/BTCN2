import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function MovieCard({ movie }) {
  return (
    <div className="relative group/card w-full aspect-2/3 cursor-pointer hover:z-50 transition-all duration-300">
      <div className="w-full h-full rounded-lg shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover/card:scale-110 group-hover/card:shadow-2xl bg-gray-900">
        <Link
          to={`/movie/${movie.id}`}
          className="block w-full h-full rounded-lg overflow-hidden"
        >
          <img
            src={movie.image || "https://placehold.co/400x600?text=No+Image"}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="absolute left-0 right-0 -bottom-22 bg-[#1a1a1a] dark:bg-gray-900 p-3 rounded-b-lg shadow-[0_10px_20px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-10 pointer-events-none group-hover/card:pointer-events-auto transform group-hover/card:scale-110 origin-top">
        <h3 className="text-white text-sm font-bold line-clamp-1 text-center mb-1">
          <Link
            to={`/movie/${movie.id}`}
            className="hover:text-blue-400 transition-colors"
          >
            {movie.title}
          </Link>
        </h3>

        <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={10} fill="currentColor" />
            {movie.rate ? Number(movie.rate).toFixed(1) : "N/A"}
          </span>
        </div>

        <div className="text-[10px] text-gray-500 text-center italic truncate">
          {movie.genres ? movie.genres.slice(0, 3).join(", ") : ""}
        </div>
      </div>
    </div>
  );
}
