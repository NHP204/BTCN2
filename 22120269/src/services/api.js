const API_URL = "/api";

const APP_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

const fetchClient = async (endpoint, options = {}) => {
  const userToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "x-app-token": APP_TOKEN,
    ...options.headers,
  };

  if (userToken) {
    headers["Authorization"] = `Bearer ${userToken}`;
  }

  let url = `${API_URL}${endpoint}`;
  if (options.params) {
    const cleanParams = Object.fromEntries(
      Object.entries(options.params).filter(([_, v]) => v != null)
    );
    const params = new URLSearchParams(cleanParams);
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

export const movieService = {
  getMovieList: (page = 1) => fetchClient(`/movies`, { params: { page } }),

  getPopular: (page = 1) =>
    fetchClient(`/movies/most-popular`, { params: { page } }),

  getTopRated: (page = 1) =>
    fetchClient(`/movies/top-rated`, { params: { page } }),

  search: (keyword, page = 1) =>
    fetchClient(`/movies/search`, {
      params: {
        q: keyword,
        page,
      },
    }),

  getDetails: (id) => fetchClient(`/movies/${id}`),

  getPersonDetail: (id) => fetchClient(`/persons/${id}`),

  getMovieCredits: (id) => fetchClient(`/movies/${id}/credits`),
};

export default movieService;
