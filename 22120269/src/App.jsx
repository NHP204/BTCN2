import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MovieDetail from "@/pages/MovieDetail";
import PersonDetail from "@/pages/PersonDetail";
import Search from "@/pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "movie/:id", element: <MovieDetail /> },
      { path: "search", element: <Search /> },
      { path: "/persons/:id", element: <PersonDetail /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
