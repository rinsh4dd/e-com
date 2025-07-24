import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../service/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartLength, setCartLength] = useState(0);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

useEffect(() => {
    if (user) {
      fetch(`${URL}/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCartLength(data.cart ? data.cart.length : 0);
        })
        .catch((err) => console.log("Failed to load cart:", err));
   }
},[user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => setUser(userData);
  const register = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
  
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, register, logout, loading,setCartLength,cartLength }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
