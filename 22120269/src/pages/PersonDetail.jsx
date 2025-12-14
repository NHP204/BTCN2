import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieService } from "../services/api";
import { ArrowLeft, Calendar, Activity, UserMinus } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        const data = await movieService.getPersonDetail(id);
        setPerson(data.data || data);
      } catch (error) {
        console.error("Error fetching person:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      return isoString.split("T")[0];
    } catch (e) {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy thông tin diễn viên.
      </div>
    );
  }

  const imageUrl = person.image || "https://placehold.co/400x600?text=No+Image";
  const bio = person.summary || "Chưa có tiểu sử.";
  const movieList = person.known_for || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12 animate-fade-in-up">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-200 dark:bg-gray-700 relative">
              <img
                src={imageUrl}
                alt={person.name}
                className="w-full h-full object-cover aspect-3/4"
              />
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-10 space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {person.name}
                </h1>
                {person.role && (
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-xl">
                    {person.role}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                {person.birth_date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                        Ngày sinh
                      </p>
                      <p className="font-semibold text-base">
                        {formatDate(person.birth_date)}
                      </p>
                    </div>
                  </div>
                )}

                {person.death_date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                      <UserMinus size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                        Ngày mất
                      </p>
                      <p className="font-semibold text-base">
                        {formatDate(person.death_date)}
                      </p>
                    </div>
                  </div>
                )}

                {person.height && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                        Chiều cao
                      </p>
                      <p className="font-semibold text-base">{person.height}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 border-l-4 border-blue-500 pl-3">
                  Tiểu sử
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line text-lg">
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {movieList.length > 0 && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 dark:text-white">
              <span className="w-2 h-8 bg-blue-600 rounded-full block"></span>
              Phim đã tham gia{" "}
              <span className="text-gray-500 text-lg font-normal">
                ({movieList.length})
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 overflow-visible pb-20">
              {movieList.map((movie) => {
                const compatibleMovieData = {
                  ...movie,
                  release_date: movie.year ? String(movie.year) : undefined,
                  poster_path: movie.image,
                };

                return (
                  <div key={movie.id} className="h-full">
                    <MovieCard movie={compatibleMovieData} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
