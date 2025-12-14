import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-300 mx-auto px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
