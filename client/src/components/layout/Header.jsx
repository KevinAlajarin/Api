import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Heart } from 'lucide-react';
import LoginModal from '../forms/LoginModal';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Función para navegar a secciones de la página principal
  const navigateToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Si no estamos en la página principal, navegar primero
      navigate('/');
      // Usar setTimeout para esperar a que la navegación se complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Si ya estamos en la página principal, hacer scroll directo
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
                     <Link to="/" className="logo">
             <Heart size={24} className="logo-icon" />
             <div className="logo-text">
               <h2>Dr. Juan Pérez</h2>
               <span>Cardiología</span>
             </div>
           </Link>

                     {/* Navegación desktop */}
          <nav className="nav-desktop">
            <button 
              onClick={() => navigateToSection('inicio')}
              className="nav-button"
            >
              Inicio
            </button>
             <button 
               onClick={() => navigateToSection('servicios')}
               className="nav-button"
             >
               Servicios
             </button>
             <button 
               onClick={() => navigateToSection('formacion')}
               className="nav-button"
             >
               Formación
             </button>
             <button 
               onClick={() => navigateToSection('contacto')}
               className="nav-button"
             >
               Contacto
             </button>
             {isAuthenticated() ? (
               <Link to="/admin" className="btn btn-primary">Gestionar Citas</Link>
             ) : (
               <Link to="/reservar" className="btn btn-primary">Reservar Cita</Link>
             )}
           </nav>

          {/* Botón de login/logout */}
          <div className="auth-section">
            {isAuthenticated() ? (
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <User size={20} />
                  <span>{user.name}</span>
                </button>
                
                                 {isMenuOpen && (
                   <div className="dropdown-menu">
                     <button onClick={handleLogout} className="dropdown-item">
                       <LogOut size={16} />
                       Cerrar Sesión
                     </button>
                   </div>
                 )}
              </div>
            ) : (
              <button 
                className="btn btn-outline"
                onClick={() => setShowLoginModal(true)}
              >
                <User size={16} />
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

                 {/* Navegación móvil */}
        {isMenuOpen && (
          <nav className="nav-mobile">
            <button 
              onClick={() => navigateToSection('inicio')}
              className="nav-button-mobile"
            >
              Inicio
            </button>
             <button 
               onClick={() => navigateToSection('servicios')}
               className="nav-button-mobile"
             >
               Servicios
             </button>
             <button 
               onClick={() => navigateToSection('formacion')}
               className="nav-button-mobile"
             >
               Formación
             </button>
             <button 
               onClick={() => navigateToSection('contacto')}
               className="nav-button-mobile"
             >
               Contacto
             </button>
             {isAuthenticated() ? (
               <Link to="/admin" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                 Gestionar Citas
               </Link>
             ) : (
               <Link to="/reservar" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                 Reservar Cita
               </Link>
             )}
           </nav>
         )}
      </div>

      {/* Modal de Login */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default Header;
