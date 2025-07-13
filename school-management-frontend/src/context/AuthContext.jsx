import React, { createContext, useState, useEffect } from "react";
import { isAuthenticated, getUserFromToken } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = isAuthenticated() ? getUserFromToken() : null;
    if (user) {
      setAuth(user);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};