import React, { createContext, useState, useEffect } from "react";

// Creamos el contexto
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // Buscamos si existe un token de usuario guardado en localStorage
    if (storedUser) {
      setUser(storedUser); // Si existe, lo cargamos al estado 
    }
  }, []); // Lo ejecutamos una vez

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    // Devolvemos user y la función de setUser
    <AuthContext.Provider value={{ user, setUser }}> 
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar useAuth en lugar de useContext. Son equivalentes
export const useAuth = () => {
  return React.useContext(AuthContext);
};