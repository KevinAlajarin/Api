import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Importamos axios

// URL de tu backend para autenticación
const API_URL = 'http://localhost:3000/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario y token guardados al recargar
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        // Opcional: Aquí podrías validar si el token sigue siendo válido con el backend
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Llamamos al endpoint de login del backend
      // Enviamos { username: '...', password: '...' }
      const response = await axios.post(`${API_URL}/login`, credentials);

      if (response.data.success) {
        const { user, token } = response.data;

        // Guardamos el usuario en el estado
        setUser(user);

        // Guardamos sesión en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        return { success: true, user };
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      // Capturamos el mensaje de error que viene del backend (ej: "Contraseña incorrecta")
      const errorMessage = error.response?.data?.message || 'Error al conectar con el servidor';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};