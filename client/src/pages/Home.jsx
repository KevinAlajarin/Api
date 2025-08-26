import { Heart, Stethoscope, Clock, MapPin, Phone, Mail, Award, Users, Activity, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const services = [
    {
      icon: <Heart size={32} />,
      title: 'Consulta Cardiológica',
      description: 'Evaluación completa del sistema cardiovascular con tecnología de última generación.'
    },
    {
      icon: <Stethoscope size={32} />,
      title: 'Electrocardiograma',
      description: 'Estudio del ritmo cardíaco para detectar arritmias y otras anomalías.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Monitoreo Holter',
      description: 'Seguimiento continuo de la actividad cardíaca durante 24-48 horas.'
    },
    {
      icon: <Users size={32} />,
      title: 'Prevención Cardiovascular',
      description: 'Programas de prevención y educación para mantener un corazón saludable.'
    },
    {
      icon: <Monitor size={32} />,
      title: 'Ecocardiograma',
      description: 'Imágenes detalladas del corazón en movimiento para evaluar su estructura, función y válvulas.'
    },
    {
      icon: <Activity size={32} />,
      title: 'Prueba de Esfuerzo',
      description: 'Evaluación del comportamiento cardíaco durante la actividad física controlada para diagnosticar enfermedad arterial.'
    }
  ];

  const education = [
    {
      year: '2005-2011',
      title: 'Medicina',
      institution: 'Universidad de Buenos Aires'
    },
    {
      year: '2012-2014',
      title: 'Especialización en Cardiología',
      institution: 'Universidad de Buenos Aires'
    },
    {
      year: '2016',
      title: 'Fellowship en Cardiología Intervencionista',
      institution: 'Cleveland Clinic, Estados Unidos'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Dr. Juan Pérez</h1>
              <h2>Cardiólogo Especialista</h2>
              <p>
                Más de 10 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares. 
                Comprometido con la salud de sus pacientes y la excelencia médica.
              </p>
                             <div className="hero-actions">
                 {isAuthenticated() ? (
                   <Link to="/admin" className="btn btn-primary">
                     Gestionar Citas
                   </Link>
                 ) : (
                   <Link to="/reservar" className="btn btn-primary">
                     Reservar Cita
                   </Link>
                 )}
                 <button 
                   onClick={() => {
                     const element = document.getElementById('servicios');
                     if (element) {
                       element.scrollIntoView({ behavior: 'smooth' });
                     }
                   }}
                   className="btn btn-primary"
                 >
                   Conocer Servicios
                 </button>
               </div>
            </div>
            <div className="hero-image">
              <div className="doctor-avatar">
                <Stethoscope size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="services">
        <div className="container">
          <div className="section-header">
            <h2>Servicios Médicos</h2>
            <p>Ofrecemos una amplia gama de servicios cardiovasculares con la más alta calidad</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formación */}
      <section id="formacion" className="education">
        <div className="container">
          <div className="section-header">
            <h2>Formación Académica</h2>
            <p>Una sólida base educativa que respalda nuestra experiencia profesional</p>
          </div>
          
          <div className="education-timeline">
            {education.map((item, index) => (
              <div key={index} className="education-item">
                <div className="education-year">{item.year}</div>
                <div className="education-content">
                  <h3>{item.title}</h3>
                  <p>{item.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Información de Contacto</h2>
            <p>Estamos aquí para ayudarte. Contáctanos para más información</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={24} />
                <div>
                  <h4>Dirección</h4>
                  <p>Av. Corrientes 1234, CABA<br />Buenos Aires, Argentina</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Phone size={24} />
                <div>
                  <h4>Teléfono</h4>
                  <p>+54 11 1234-5678</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Mail size={24} />
                <div>
                  <h4>Email</h4>
                  <p>dr.perez@clinica.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Clock size={24} />
                <div>
                  <h4>Horarios de Atención</h4>
                  <p>Lunes a Viernes: 9:00 - 18:00<br />Sábados: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
            
                         <div className="contact-cta">
               <h3>¿Necesitas una consulta?</h3>
               <p>Reserva tu cita ahora y cuida tu salud cardiovascular</p>
               {isAuthenticated() ? (
                 <Link to="/admin" className="btn btn-primary">
                   Gestionar Citas
                 </Link>
               ) : (
                 <Link to="/reservar" className="btn btn-primary">
                   Reservar Cita
                 </Link>
               )}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
