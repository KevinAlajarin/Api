import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        onClose();
        setFormData({ username: '', password: '' });
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Iniciar Sesión</h3>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingrese su usuario"
              required
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese su contraseña"
                required
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Iniciando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default LoginModal;
