import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    addToast({
      type: "success",
      title: "Welcome back",
      message: `Logged in as ${res.data.user.name}`,
    });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    addToast({
      type: "success",
      title: "Account created",
      message: "Your productivity workspace is ready.",
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    addToast({
      type: "info",
      title: "Signed out",
      message: "You have been logged out successfully.",
    });
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
