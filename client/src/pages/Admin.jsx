import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocialSecurity } from '../context/SocialSecurityContext';
import { Plus, Edit, Trash2, Calendar, Building, Users } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    obrasSociales, 
    loading, 
    createObraSocial, 
    updateObraSocial, 
    deleteObraSocial 
  } = useSocialSecurity();

  const [showObraSocialForm, setShowObraSocialForm] = useState(false);
  const [editingObraSocial, setEditingObraSocial] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });

  // Verificar autenticación
  if (!isAuthenticated()) {
    return (
      <div className="admin-unauthorized">
        <div className="container">
          <h1>Acceso No Autorizado</h1>
          <p>Debe iniciar sesión para acceder al panel administrativo.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingObraSocial) {
      // Actualizar obra social existente
      const result = await updateObraSocial(editingObraSocial.id, { nombre: formData.nombre });
      if (result.success) {
        setEditingObraSocial(null);
        setFormData({ nombre: '' });
        setShowObraSocialForm(false);
      }
    } else {
      // Crear nueva obra social
      const result = await createObraSocial(formData.nombre);
      if (result.success) {
        setFormData({ nombre: '' });
        setShowObraSocialForm(false);
      }
    }
  };

  const handleEdit = (obraSocial) => {
    setEditingObraSocial(obraSocial);
    setFormData({ nombre: obraSocial.nombre });
    setShowObraSocialForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta obra social?')) {
      await deleteObraSocial(id);
    }
  };

  const handleCancel = () => {
    setEditingObraSocial(null);
    setFormData({ nombre: '' });
    setShowObraSocialForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <h1>Panel Administrativo</h1>
          <p>Bienvenido, {user?.name}</p>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">
              <Calendar size={32} />
            </div>
            <div className="card-content">
              <h3>Citas Pendientes</h3>
              <p className="card-number">12</p>
              <span className="card-label">Por confirmar</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <Building size={32} />
            </div>
            <div className="card-content">
              <h3>Obras Sociales</h3>
              <p className="card-number">{obrasSociales.length}</p>
              <span className="card-label">Activas</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <Users size={32} />
            </div>
            <div className="card-content">
              <h3>Pacientes</h3>
              <p className="card-number">156</p>
              <span className="card-label">Registrados</span>
            </div>
          </div>
        </div>

        {/* Obras Sociales Section */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Gestión de Obras Sociales</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowObraSocialForm(true)}
            >
              <Plus size={16} />
              Nueva Obra Social
            </button>
          </div>

          {/* Formulario de Obra Social */}
          {showObraSocialForm && (
            <div className="obra-social-form">
              <h3>{editingObraSocial ? 'Editar' : 'Nueva'} Obra Social</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ nombre: e.target.value })}
                    className="form-input"
                    placeholder="Nombre de la obra social"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : (editingObraSocial ? 'Actualizar' : 'Crear')}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Obras Sociales */}
          <div className="obras-sociales-list">
            {obrasSociales.map((obra) => (
              <div key={obra.id} className="obra-social-item">
                <div className="obra-social-info">
                  <h4>{obra.nombre}</h4>
                  <span className={`status ${obra.activa ? 'active' : 'inactive'}`}>
                    {obra.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="obra-social-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => handleEdit(obra)}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleDelete(obra.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestión de Citas Section */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Gestión de Citas</h2>
            <p>Aquí podrás ver y gestionar todas las citas solicitadas</p>
          </div>
          
          <div className="citas-placeholder">
            <p>La gestión de citas se implementará en la siguiente fase del desarrollo.</p>
            <p>Incluirá:</p>
            <ul>
              <li>Lista de citas solicitadas</li>
              <li>Cambio de estado (Solicitada → Confirmada)</li>
              <li>Filtros por fecha y estado</li>
              <li>Notificaciones por email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
