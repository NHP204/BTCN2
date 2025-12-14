import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "@/services/api";
import { Loader2 } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";

export default function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await movieService.search(query);

          console.log("Kết quả API:", data);

          const resultList = data.results || data.data || [];
          setMovies(resultList);
        } catch (error) {
          console.error("Search error:", error);
          setError("Có lỗi xảy ra khi tìm kiếm.");
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen py-8 space-y-6">
      {query ? (
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-l-4 border-blue-500 pl-4">
            Kết quả tìm kiếm: <span className="text-blue-600">"{query}"</span>
          </h2>
          <span className="text-gray-500 text-sm">
            ({movies.length} kết quả)
          </span>
        </div>
      ) : (
        <h2 className="text-xl text-gray-500 text-center mt-10">
          Hãy nhập tên phim vào ô tìm kiếm trên cùng...
        </h2>
      )}

      {loading && (
        <div className="flex h-40 items-center justify-center text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-visible pb-20">
          {movies.map((movie) => (
            <div key={movie.id} className="h-full">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {!loading && query && movies.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 text-lg">
            Không tìm thấy phim nào có tên "{query}".
          </p>
        </div>
      )}
    </div>
  );
}
