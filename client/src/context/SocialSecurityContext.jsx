import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Necesitarás axios para las llamadas a la API


const API_URL = 'http://localhost:3000/api/obras-sociales'; 
const SocialSecurityContext = createContext();

export const useSocialSecurity = () => {
// ... (tu código de useSocialSecurity no cambia)
  const context = useContext(SocialSecurityContext);
  if (!context) {
   throw new Error('useSocialSecurity debe ser usado dentro de un SocialSecurityProvider');
  }
  return context;
};

export const SocialSecurityProvider = ({ children }) => {
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true); // Inicia en true mientras carga

  // URL de tu API (¡Asegúrate que coincida!)
  // O el puerto que estés usando

  // Cargar obras sociales DESDE LA API al inicializar
  const fetchObrasSociales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data) {
        setObrasSociales(response.data);
      }
    } catch (error) {
      console.error('Error al cargar obras sociales desde la API:', error);
      // Opcional: Cargar datos por defecto si la API falla
      // loadDefaultObrasSociales(); 
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    fetchObrasSociales();
  }, [fetchObrasSociales]);

  // Se ejecuta solo una vez al montar el provider

  // --- GESTIÓN DE OBRAS SOCIALES (Panel de Admin) ---
   // Estas funciones (crear, actualizar, borrar) ahora
   // también deberían llamar a la API.
   // PERO, estas son acciones de ADMINISTRADOR (Médico/Asistente).
   // El paciente que pide la cita (Form.jsx) NO debería poder crear obras sociales.

   // Por ahora, nos enfocaremos en LEER.
   // Dejamos estas funciones "listas" para cuando implementes el login.
   // Necesitarán enviar el TOKEN de autenticación (Paso 2 y 3 del plan).

  // Crear nueva obra social (Admin)
  const createObraSocial = async (nombre, activa) => {
    setLoading(true);
     setLoading(true);
    try {
      // Ahora sí usamos el valor 'activa' que viene del formulario
      const response = await axios.post(API_URL, { 
        nombre: nombre.trim(), 
        activa: activa 
      });
      
      const newObraSocial = response.data;
      setObrasSociales([...obrasSociales, newObraSocial]);
      
      return { success: true, obraSocial: newObraSocial };

    } catch (error) {
      console.error('Error al crear obra social:', error);
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, error: errorMessage }; 
    } finally {
      setLoading(false);
    }
  };

  // Actualizar obra social (Admin)
  const updateObraSocial = async (id, updates) => {
    setLoading(true);
    try {
      // Llamamos a la API con PUT
      const response = await axios.put(`${API_URL}/${id}`, updates);
      
      // Actualizamos el estado local
      const updatedObra = response.data;
      setObrasSociales(obrasSociales.map(obra => 
        obra.id === id ? updatedObra : obra
      ));
      
      return { success: true };

    } catch (error) {
      console.error('Error al actualizar obra social:', error);
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  
  

  // --- FUNCIONES PÚBLICAS (Para el Form.jsx) ---

   // Obtener obras sociales activas
  const getActiveObrasSociales = () => {
    // Filtramos por 'activa: true'
    return obrasSociales.filter(obra => obra.activa);
  };

  // Obtener obra social por ID
  const getObraSocialById = (id) => {
   return obrasSociales.find(obra => obra.id === id);
  };

  const value = {
    obrasSociales, // Lista completa para el Admin
    loading,
    fetchObrasSociales, // Para refrescar la lista si es necesario
    createObraSocial,
    updateObraSocial,
    getActiveObrasSociales, // Lista filtrada para el Formulario
    getObraSocialById
  };

  return (
    <SocialSecurityContext.Provider value={value}>
      {children}
    </SocialSecurityContext.Provider>
 );
};