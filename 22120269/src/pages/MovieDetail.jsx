import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { movieService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Star,
  Clock,
  ArrowLeft,
  Heart,
  Award,
  DollarSign,
  Video,
  User,
} from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await movieService.getDetails(id);
        const movieData = data.data || data;
        setMovie(movieData);
        console.log("user222", user.user);

        if (user) {
          try {
            const favResponse = await movieService.getFavorites();
            const favList = favResponse.data || favResponse || [];
            const isFav = favList.some((fav) => String(fav.id) === String(id));
            setIsFavorite(isFav);
          } catch (error) {
            console.warn("Không thể tải trạng thái yêu thích:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      if (
        confirm(
          "Bạn cần đăng nhập để sử dụng tính năng yêu thích. Đăng nhập ngay?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    try {
      if (isFavorite) {
        await movieService.removeFavorite(id);
        setIsFavorite(false);
        alert("Đã xóa khỏi danh sách yêu thích!");
      } else {
        await movieService.addFavorite(id);
        setIsFavorite(true);
        alert("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi khi thao tác yêu thích:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!movie)
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy thông tin phim.
      </div>
    );

  const imageUrl = movie.image || movie.poster_path;

  const description = (
    movie.plot_full ||
    movie.short_description ||
    movie.overview ||
    "Chưa có mô tả."
  ).replace(/<[^>]+>/g, "");

  const genres = movie.genres || [];
  const actors = movie.actors || [];
  const directors = movie.directors || [];
  const reviews = movie.reviews || [];

  const budget = movie.box_office?.budget;
  const gross =
    movie.box_office?.cumulativeWorldwideGross || movie.box_office?.grossUSA;

  const ratings = movie.ratings || {};

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white overflow-hidden pb-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 blur-3xl scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="absolute inset-0 bg-linear-to-t from-white dark:from-gray-900 via-transparent to-transparent"></div>

      <div className="relative container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Quay lại
        </Link>

        <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
          <div className="w-full md:w-1/3 shrink-0">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
              <img
                src={imageUrl}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {movie.full_title || movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              {ratings.imDb && (
                <span className="px-2 py-1 bg-yellow-400 text-black rounded font-bold">
                  IMDb {ratings.imDb}
                </span>
              )}
              {ratings.metacritic && (
                <span className="px-2 py-1 bg-green-600 text-white rounded font-bold">
                  Metascore {ratings.metacritic}
                </span>
              )}
              {ratings.rottenTomatoes && (
                <span className="px-2 py-1 bg-red-600 text-white rounded font-bold">
                  Tomatometer {ratings.rottenTomatoes}%
                </span>
              )}
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 ml-2">
                <Clock size={16} /> <span>{movie.runtime || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.map((g, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-lg text-xs font-bold"
                >
                  {g}
                </span>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-2">
                Nội dung
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl text-sm">
              {directors.length > 0 && (
                <div className="flex gap-2">
                  <Video size={18} className="text-blue-500 shrink-0" />
                  <div>
                    <span className="font-bold block">Đạo diễn:</span>
                    {directors.map((d) => d.name).join(", ")}
                  </div>
                </div>
              )}
              {movie.awards && (
                <div className="flex gap-2">
                  <Award size={18} className="text-yellow-500 shrink-0" />
                  <div>
                    <span className="font-bold block">Giải thưởng:</span>
                    <span className="line-clamp-2">{movie.awards}</span>
                  </div>
                </div>
              )}
              {(budget || gross) && (
                <div className="flex gap-2 sm:col-span-2">
                  <DollarSign size={18} className="text-green-500 shrink-0" />
                  <div className="flex flex-wrap gap-x-6">
                    {budget && (
                      <span>
                        <span className="font-bold">Ngân sách:</span> {budget}
                      </span>
                    )}
                    {gross && (
                      <span>
                        <span className="font-bold">Doanh thu:</span> {gross}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 transition-all cursor-pointer ${
                isFavorite
                  ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-transparent border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />{" "}
              {isFavorite ? "Đã Yêu Thích" : "Thêm vào Yêu Thích"}
            </button>
          </div>
        </div>

        {actors.length > 0 && (
          <div className="mb-12 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>{" "}
              Diễn viên
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {actors.map((actor) => (
                <Link
                  to={`/person/${actor.id}`}
                  key={actor.id}
                  className="min-w-35 w-35 snap-start group cursor-pointer"
                >
                  <div className="w-full h-45 rounded-xl overflow-hidden shadow-lg mb-3 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={
                        actor.image ||
                        "https://placehold.co/200x300?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-sm truncate group-hover:text-blue-500">
                      {actor.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {actor.character || "Actor"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-green-600 rounded-full block"></span>{" "}
              Bình luận nổi bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-bold text-blue-600">
                      <User size={18} />{" "}
                      {review.username || "Người dùng ẩn danh"}
                    </div>
                    {review.rate > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                        <Star size={14} fill="currentColor" /> {review.rate}/10
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm mb-2 uppercase text-gray-700 dark:text-gray-300">
                    {review.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 italic">
                    "{review.content}"
                  </p>
                  <div className="mt-3 text-xs text-gray-400 text-right">
                    {review.date?.split("T")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
