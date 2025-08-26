import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
                     <div className="footer-section">
             <Link to="/" className="footer-logo">
               <Heart size={32} />
               <div className="footer-logo-text">
                 <h3>Dr. Juan Pérez</h3>
                 <span>Cardiología</span>
               </div>
             </Link>
            <p>
              Más de 10 años de experiencia en el diagnóstico y tratamiento 
              de enfermedades cardiovasculares. Su salud es nuestra prioridad.
            </p>
          </div>

          <div className="footer-section">
            <h4>Información de Contacto</h4>
            <div className="contact-list">
              <div className="contact-item">
                <MapPin size={16} />
                <span>Av. Corrientes 1234, CABA<br />Buenos Aires, Argentina</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>dr.perez@clinica.com</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span>Lun-Vie: 9:00-18:00<br />Sáb: 9:00-13:00</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Servicios</h4>
            <ul className="footer-links">
              <li><a href="#servicios">Consulta Cardiológica</a></li>
              <li><a href="#servicios">Electrocardiograma</a></li>
              <li><a href="#servicios">Monitoreo Holter</a></li>
              <li><a href="#servicios">Prevención Cardiovascular</a></li>
              <li><a href="#servicios">Ecocardiograma</a></li>
              <li><a href="#servicios">Prueba de Esfuerzo</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
                         <ul className="footer-links">
               <li><Link to="/">Inicio</Link></li>
               {isAuthenticated() ? (
                 <li><Link to="/admin">Gestionar Citas</Link></li>
               ) : (
                 <li><Link to="/reservar">Reservar Cita</Link></li>
               )}
               <li><a href="#formacion">Formación</a></li>
               <li><a href="#contacto">Contacto</a></li>
             </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Dr. Juan Pérez - Cardiología. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <a href="/privacidad">Política de Privacidad</a>
              <a href="/terminos">Términos de Uso</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
