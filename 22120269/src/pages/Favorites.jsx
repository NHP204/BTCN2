import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { movieService } from "@/services/api";
import { Heart, LogIn, Loader2 } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const response = await movieService.getFavorites();
          setFavorites(response);
          console.log("Favorites List:", response);
        } catch (error) {
          console.error("Lỗi tải danh sách yêu thích:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  const removeFavorite = async (movieId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phim này khỏi danh sách?"))
      return;

    const previousList = [...favorites];
    setFavorites(favorites.filter((m) => m.id !== movieId));

    try {
      await movieService.removeFavorite(movieId);
    } catch (error) {
      alert("Xóa thất bại, vui lòng thử lại.");
      setFavorites(previousList);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
          <Heart size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Chưa đăng nhập
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Đăng nhập để xem danh sách phim yêu thích của bạn.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <LogIn size={18} /> Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 border-l-4 border-red-500 pl-4">
          <Heart size={32} className="text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Danh sách yêu thích
          </h1>
        </div>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-visible pb-20">
            {favorites.map((movie) => {
              const compatibleMovie = {
                ...movie,
                image: movie.image_url,
                title: movie.title,
                release_date:
                  movie.release_date || (movie.year ? String(movie.year) : ""),
                rate: movie.external_ratings.imDb,
              };

              return (
                <div key={movie.id} className="h-full">
                  <MovieCard
                    movie={compatibleMovie}
                    onDelete={removeFavorite}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Danh sách trống.
            </p>
            <Link
              to="/"
              className="text-blue-600 hover:underline mt-2 inline-block font-medium"
            >
              Khám phá phim ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
