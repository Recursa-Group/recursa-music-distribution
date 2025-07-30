import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ Children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      localStorage.clear("access_token");
      localStorage.clear("refresh_token");
    } finally {
      setLoading(false);
    }

    const login = async () => {
      const res = await api.post("/auth/login", userData);
      const { artist, tokens } = res.data;

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokens.access_token}`;

      setUser(artist);
      return artist;
    };

    const register = async () => {
      const res = await api.post("/auth/register", userData);
      const { artist, tokens } = res.data;

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokens.access_token}`;

      setUser(artist);
      return artist;
    };

    const logout = async () => {
      localStorage.clear("access_token");
      localStorage.clear("refresh_token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    };

    const value = {
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    };

    return (
      <AuthContext.Provider value={value}>{Children}</AuthContext.Provider>
    );
  };
};
