import { createContext, useContext, useState, useEffect } from 'react';

const SocialSecurityContext = createContext();

export const useSocialSecurity = () => {
  const context = useContext(SocialSecurityContext);
  if (!context) {
    throw new Error('useSocialSecurity debe ser usado dentro de un SocialSecurityProvider');
  }
  return context;
};

export const SocialSecurityProvider = ({ children }) => {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar obras sociales desde localStorage al inicializar
  useEffect(() => {
    const savedObrasSociales = localStorage.getItem('obrasSociales');
    if (savedObrasSociales) {
      try {
        setObrasSociales(JSON.parse(savedObrasSociales));
      } catch (error) {
        console.error('Error al parsear obras sociales guardadas:', error);
        localStorage.removeItem('obrasSociales');
        // Cargar obras sociales por defecto
        loadDefaultObrasSociales();
      }
    } else {
      loadDefaultObrasSociales();
    }
  }, []);

  // Cargar obras sociales por defecto
  const loadDefaultObrasSociales = () => {
    const defaultObrasSociales = [
      { id: 1, nombre: 'OSDE', activa: true },
      { id: 2, nombre: 'Swiss Medical', activa: true },
      { id: 3, nombre: 'Galeno', activa: true },
      { id: 4, nombre: 'Medicus', activa: true },
      { id: 5, nombre: 'Particular', activa: true },
      { id: 6, nombre: 'Otros', activa: true }
    ];
    setObrasSociales(defaultObrasSociales);
    localStorage.setItem('obrasSociales', JSON.stringify(defaultObrasSociales));
  };

  // Crear nueva obra social
  const createObraSocial = async (nombre) => {
    setLoading(true);
    try {
      const newObraSocial = {
        id: Date.now(),
        nombre: nombre.trim(),
        activa: true,
        createdAt: new Date().toISOString()
      };

      const updatedObrasSociales = [...obrasSociales, newObraSocial];
      setObrasSociales(updatedObrasSociales);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObrasSociales));
      
      return { success: true, obraSocial: newObraSocial };
    } catch (error) {
      console.error('Error al crear obra social:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar obra social
  const updateObraSocial = async (id, updates) => {
    setLoading(true);
    try {
      const updatedObrasSociales = obrasSociales.map(obra => 
        obra.id === id ? { ...obra, ...updates, updatedAt: new Date().toISOString() } : obra
      );
      
      setObrasSociales(updatedObrasSociales);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObrasSociales));
      
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar obra social:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar obra social
  const deleteObraSocial = async (id) => {
    setLoading(true);
    try {
      const updatedObrasSociales = obrasSociales.filter(obra => obra.id !== id);
      setObrasSociales(updatedObrasSociales);
      localStorage.setItem('obrasSociales', JSON.stringify(updatedObrasSociales));
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar obra social:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener obras sociales activas
  const getActiveObrasSociales = () => {
    return obrasSociales.filter(obra => obra.activa);
  };

  // Obtener obra social por ID
  const getObraSocialById = (id) => {
    return obrasSociales.find(obra => obra.id === id);
  };

  const value = {
    obrasSociales,
    loading,
    createObraSocial,
    updateObraSocial,
    deleteObraSocial,
    getActiveObrasSociales,
    getObraSocialById
  };

  return (
    <SocialSecurityContext.Provider value={value}>
      {children}
    </SocialSecurityContext.Provider>
  );
};
