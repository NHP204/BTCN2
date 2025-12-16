import { createContext, useState, useContext, useEffect } from "react";
import { movieService } from "@/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse user từ storage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await movieService.login({ username, password });

      const token =
        response.accessToken || response.token || response.data?.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
      }

      const responseData = response.data || response;

      const actualUser = responseData.user ? responseData.user : responseData;

      const userToSave = { ...actualUser };
      delete userToSave.accessToken;
      delete userToSave.token;

      setUser(userToSave);
      localStorage.setItem("user", JSON.stringify(userToSave));

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (formData) => {
    try {
      await movieService.register(formData);
      return true;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await movieService.logout();
    } catch (error) {
      console.warn("Logout API error", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
