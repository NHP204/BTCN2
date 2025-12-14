import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { movieService } from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";

export default function Home() {
  const [bannerMovies, setBannerMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [listData, popularData, topRatedData] = await Promise.all([
          movieService.getMovieList(1),
          movieService.getPopular(1),
          movieService.getTopRated(1),
        ]);

        const getResults = (data) => data?.results || data?.data || [];

        setBannerMovies(getResults(listData).slice(0, 5));
        setPopularMovies(getResults(popularData));
        setTopRatedMovies(getResults(topRatedData));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) =>
      prev === bannerMovies.length - 1 ? 0 : prev + 1
    );
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) =>
      prev === 0 ? bannerMovies.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (bannerMovies.length === 0) return;

    const timer = setInterval(() => {
      nextBanner();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentBannerIndex, bannerMovies]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentBanner = bannerMovies[currentBannerIndex];

  return (
    <div className="space-y-12 pb-10">
      {bannerMovies.length > 0 && (
        <section className="relative w-full flex items-center justify-center py-20">
          <button
            onClick={prevBanner}
            className="absolute left-0 md:left-16 top-1/2 -translate-y-1/2 p-4 text-gray-400 hover:text-gray-800 dark:text-gray-600 dark:hover:text-white transition-colors z-20"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative group w-55 md:w-75 aspect-2/3 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-125 hover:z-50">
            <Link
              to={`/movie/${currentBanner.id}`}
              className="block h-full rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] bg-black"
            >
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover rounded-xl"
              />
            </Link>

            <div className="absolute -bottom-20 left-0 right-0 bg-[#1a1a1a] dark:bg-[#1a1a1a] p-4 rounded-b-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
              <h3 className="text-white font-bold text-lg md:text-xl line-clamp-1 text-center">
                {currentBanner.title}
              </h3>
              <p className="text-gray-400 text-sm text-center mt-1 font-medium">
                {currentBanner.release_date?.split("-")[0]}
              </p>
            </div>
          </div>

          <button
            onClick={nextBanner}
            className="absolute right-0 md:right-16 top-1/2 -translate-y-1/2 p-4 text-gray-400 hover:text-gray-800 dark:text-gray-600 dark:hover:text-white transition-colors z-20"
          >
            <ChevronRight size={48} />
          </button>
        </section>
      )}

      <PagedMovieRow title="Most Popular" movies={popularMovies} />
      <PagedMovieRow title="Top Rating" movies={topRatedMovies} />
    </div>
  );
}

function PagedMovieRow({ title, movies }) {
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 3;

  const maxPage =
    movies && movies.length > 0
      ? Math.ceil(movies.length / ITEMS_PER_PAGE) - 1
      : 0;

  const nextPage = () => setPage((p) => (p === maxPage ? 0 : p + 1));
  const prevPage = () => setPage((p) => (p === 0 ? maxPage : p - 1));

  useEffect(() => {
    if (!movies || movies.length === 0 || maxPage <= 0) return;

    const timer = setInterval(() => {
      nextPage();
    }, 5000);

    return () => clearInterval(timer);
  }, [page, movies, maxPage]);

  if (!movies || movies.length === 0) return null;

  const currentMovies = movies.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xl font-bold border-l-4 border-blue-600 pl-3 text-gray-800 dark:text-white">
          {title}
        </h3>
        <div className="text-sm text-gray-500">
          Trang {page + 1} / {maxPage + 1}
        </div>
      </div>

      <div className="relative group/row px-4 md:px-12">
        <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:bg-blue-600 hover:text-white transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          key={page}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-visible py-4 animate-fade-in-up"
        >
          {currentMovies.map((movie) => (
            <div key={movie.id} className="h-full">
              <MovieCard movie={movie} />
            </div>
          ))}
          {[...Array(ITEMS_PER_PAGE - currentMovies.length)].map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:block"></div>
          ))}
        </div>

        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:bg-blue-600 hover:text-white transition-all active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
