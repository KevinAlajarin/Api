import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// La URL base de tu API de citas (¡en plural!)
const API_URL = 'http://localhost:3000/api/citas';

const CitasContext = createContext();

export const useCitas = () => {
  const context = useContext(CitasContext);
  if (!context) {
    throw new Error('useCitas debe ser usado dentro de un CitasProvider');
  }
  return context;
};

export const CitasProvider = ({ children }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar todas las citas desde el backend
  const fetchCitas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar las citas cuando el componente se monta
  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Función para actualizar el estado de una cita (Confirmar/Cancelar)
  const updateCitaEstado = async (id, nuevoEstado) => {
    setLoading(true);
    try {
      // Llamamos a la nueva ruta PUT: /api/citas/:id/estado
      const response = await axios.put(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
      
      const citaActualizada = response.data;

      // Actualizamos la lista de citas en el estado local
      setCitas(prevCitas => 
        prevCitas.map(cita => 
          cita.id === id ? citaActualizada : cita
        )
      );
      
      return { success: true, cita: citaActualizada };
    } catch (error) {
      console.error('Error al actualizar estado de la cita:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    citas,
    loading,
    fetchCitas, // Por si queremos refrescar manualmente
    updateCitaEstado
  };

  return (
    <CitasContext.Provider value={value}>
      {children}
    </CitasContext.Provider>
  );
};