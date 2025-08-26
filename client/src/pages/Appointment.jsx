import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useSocialSecurity } from '../context/SocialSecurityContext';
import AppointmentForm from '../components/forms/AppointmentForm';
import './Appointment.css';

const Appointment = () => {
  const { getActiveObrasSociales } = useSocialSecurity();
  
  const appointmentInfo = [
    {
      icon: <Calendar size={24} />,
      title: 'Horarios Disponibles',
      description: 'Lunes a Viernes de 9:00 a 18:00, Sábados de 9:00 a 13:00'
    },
    {
      icon: <Clock size={24} />,
      title: 'Duración de la Consulta',
      description: 'Cada consulta tiene una duración aproximada de 30 minutos'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Ubicación',
      description: 'Av. Corrientes 1234, CABA - Buenos Aires, Argentina'
    },
    {
      icon: <Phone size={24} />,
      title: 'Contacto Directo',
      description: 'Para urgencias o consultas inmediatas: +54 11 1234-5678'
    }
  ];

  return (
    <div className="appointment-page">
      <div className="container">
        {/* Header de la página */}
        <div className="appointment-header">
          <h1>Reservar Cita Médica</h1>
          <p>
            Complete el formulario a continuación para reservar su cita con el Dr. Juan Pérez. 
            Le enviaremos una confirmación por email con todos los detalles.
          </p>
        </div>

        <div className="appointment-content">
          {/* Formulario de reserva */}
          <div className="form-container">
            <AppointmentForm />
          </div>

          {/* Información adicional */}
          <div className="info-sidebar">
            <div className="info-card">
              <h3>Información Importante</h3>
              <div className="info-list">
                {appointmentInfo.map((info, index) => (
                  <div key={index} className="info-item">
                    <div className="info-icon">
                      {info.icon}
                    </div>
                    <div className="info-content">
                      <h4>{info.title}</h4>
                      <p>{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                         <div className="info-card">
               <h3>Obras Sociales Aceptadas</h3>
               <div className="insurance-list">
                 {getActiveObrasSociales().map((obra) => (
                   <div key={obra.id} className="insurance-item">
                     <span className="insurance-name">{obra.nombre}</span>
                     <span className="insurance-status">✓ Aceptada</span>
                   </div>
                 ))}
               </div>
             </div>

            <div className="info-card">
              <h3>¿Necesita Ayuda?</h3>
              <p>
                Si tiene alguna pregunta o necesita asistencia para reservar su cita, 
                no dude en contactarnos:
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>dr.perez@clinica.com</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+54 11 1234-5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
