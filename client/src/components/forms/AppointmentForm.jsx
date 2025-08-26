import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Calendar, Clock, User, Phone, Mail, Building, CheckCircle } from 'lucide-react';
import { useSocialSecurity } from '../../context/SocialSecurityContext';
import CalendarComponent from '../ui/Calendar';
import './AppointmentForm.css';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  apellido: yup.string().required('El apellido es requerido'),
  telefono: yup.string().required('El teléfono es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  obraSocial: yup.string().required('Debe seleccionar una obra social'),
  fecha: yup.string().required('Debe seleccionar una fecha'),
  horario: yup.string().required('Debe seleccionar un horario')
});

const AppointmentForm = () => {
  const { getActiveObrasSociales } = useSocialSecurity();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema)
  });

  const watchedFecha = watch('fecha');

  // Obras sociales disponibles desde el contexto
  const obrasSociales = getActiveObrasSociales().map(obra => obra.nombre);

  // Generar fechas disponibles para las próximas 2 semanas
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Solo días laborables (lunes a viernes)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          }),
          fullDate: date
        });
      }
    }
    return dates;
  };

  // Generar horarios disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // Simular verificación de disponibilidad
  const checkAvailability = (date, time) => {
    // En una implementación real, esto verificaría contra el backend
    const random = Math.random();
    return random > 0.3; // 70% de probabilidad de estar disponible
  };

  useEffect(() => {
    if (watchedFecha) {
      const slots = generateTimeSlots();
      const available = slots.filter(slot => checkAvailability(watchedFecha, slot));
      setAvailableSlots(available);
      setValue('horario', ''); // Reset horario cuando cambia la fecha
    }
  }, [watchedFecha, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Datos de la cita:', {
        ...data,
        nombreCompleto: `${data.nombre} ${data.apellido}`
      });
      setSubmitSuccess(true);
      
      // Reset form
      setValue('nombre', '');
      setValue('apellido', '');
      setValue('telefono', '');
      setValue('email', '');
      setValue('obraSocial', '');
      setValue('fecha', '');
      setValue('horario', '');
      setSelectedDate(null);
      
    } catch (error) {
      console.error('Error al enviar la cita:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    setValue('fecha', dateString);
    
    // Actualizar horarios disponibles para la fecha seleccionada
    const slots = generateTimeSlots();
    const available = slots.filter(slot => checkAvailability(dateString, slot));
    setAvailableSlots(available);
    setValue('horario', ''); // Reset horario cuando cambia la fecha
  };

  if (submitSuccess) {
    return (
      <div className="appointment-success">
        <CheckCircle size={64} className="success-icon" />
        <h3>¡Cita Reservada Exitosamente!</h3>
        <p>Hemos enviado un email de confirmación con los detalles de su cita.</p>
        <button 
          className="btn btn-primary"
          onClick={() => setSubmitSuccess(false)}
        >
          Reservar Otra Cita
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-form-container">
      <div className="form-section">
        <h3>Información del Paciente</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                <User size={16} />
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                {...register('nombre')}
                className={`form-input ${errors.nombre ? 'error' : ''}`}
                placeholder="Su nombre"
              />
              {errors.nombre && (
                <span className="error-text">{errors.nombre.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="apellido" className="form-label">
                <User size={16} />
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                {...register('apellido')}
                className={`form-input ${errors.apellido ? 'error' : ''}`}
                placeholder="Su apellido"
              />
              {errors.apellido && (
                <span className="error-text">{errors.apellido.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                <Phone size={16} />
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                {...register('telefono')}
                className={`form-input ${errors.telefono ? 'error' : ''}`}
                placeholder="+54 11 1234-5678"
              />
              {errors.telefono && (
                <span className="error-text">{errors.telefono.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="su@email.com"
              />
              {errors.email && (
                <span className="error-text">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="obraSocial" className="form-label">
              <Building size={16} />
              Obra Social
            </label>
            <select
              id="obraSocial"
              {...register('obraSocial')}
              className={`form-select ${errors.obraSocial ? 'error' : ''}`}
            >
              <option value="">Seleccione una obra social</option>
              {obrasSociales.map((obra, index) => (
                <option key={index} value={obra}>
                  {obra}
                </option>
              ))}
            </select>
            {errors.obraSocial && (
              <span className="error-text">{errors.obraSocial.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              Seleccione una Fecha
            </label>
            <div className="calendar-wrapper">
              <CalendarComponent
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                availableDates={generateAvailableDates()}
                disabled={isSubmitting}
              />
            </div>
            {errors.fecha && (
              <span className="error-text">{errors.fecha.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="horario" className="form-label">
              <Clock size={16} />
              Horario
            </label>
            <select
              id="horario"
              {...register('horario')}
              className={`form-select ${errors.horario ? 'error' : ''}`}
              disabled={!watchedFecha}
            >
              <option value="">
                {watchedFecha ? 'Seleccione un horario' : 'Primero seleccione una fecha'}
              </option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.horario && (
              <span className="error-text">{errors.horario.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Reservando Cita...
                </>
              ) : (
                'Reservar Cita'
              )}
            </button>
          </div>
        </form> 
      </div>
    </div>
  );
};

export default AppointmentForm;