import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import PersonDetail from "@/pages/PersonDetail";
import Search from "@/pages/Search";
import SignupForm from "@/Auth/SignUpForm";
import LoginForm from "@/Auth/LoginForm";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <SignupForm /> },
      { path: "movie/:id", element: <MovieDetail /> },
      { path: "search", element: <Search /> },
      { path: "/persons/:id", element: <PersonDetail /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/favorites", element: <Favorites /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
