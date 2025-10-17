import { createContext, useContext, useState, useEffect } from 'react';

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
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Credenciales válidas hardcodeadas
      const validCredentials = {
        'medico': '123456',
        'secretaria': '123456'
      };

      // Validar credenciales
      if (!validCredentials[credentials.username] || 
          validCredentials[credentials.username] !== credentials.password) {
        return { 
          success: false, 
          error: 'Credenciales inválidas.' 
        };
      }

      // Crear usuario mock solo si las credenciales son válidas
      const mockUser = {
        id: credentials.username === 'medico' ? 1 : 2,
        username: credentials.username,
        role: credentials.username === 'medico' ? 'medico' : 'secretaria',
        name: credentials.username === 'medico' ? 'Dr. Juan Pérez' : 'María González',
        email: credentials.username === 'medico' ? 'dr.perez@clinica.com' : 'secretaria@clinica.com'
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
