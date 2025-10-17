import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocialSecurity } from '../context/SocialSecurityContext';
import { Plus, Edit, Trash2, Calendar, Building, Users, X, Mail, CheckCircle } from 'lucide-react';
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [emailNotificado, setEmailNotificado] = useState('');

  // Citas hardcodeadas (mock)
  const [citas, setCitas] = useState([
    { id: 'CIT-001', paciente: 'Ana Lopez', email: 'ana.lopez@example.com', fecha: '2025-10-01', hora: '10:00', estado: 'Solicitada' },
    { id: 'CIT-002', paciente: 'Marcos Diaz', email: 'marcos.diaz@example.com', fecha: '2025-10-01', hora: '11:30', estado: 'Confirmada' },
    { id: 'CIT-003', paciente: 'Laura Perez', email: 'laura.perez@example.com', fecha: '2025-10-02', hora: '09:15', estado: 'Solicitada' },
    { id: 'CIT-004', paciente: 'Julian Torres', email: 'julian.torres@example.com', fecha: '2025-10-03', hora: '12:00', estado: 'Solicitada' },
    { id: 'CIT-005', paciente: 'Sofia Gomez', email: 'sofia.gomez@example.com', fecha: '2025-10-03', hora: '15:45', estado: 'Confirmada' },
  ]);
  const [ordenFecha, setOrdenFecha] = useState('reciente');
  const [filtroEstado, setFiltroEstado] = useState('');


  const citasFiltradas = citas.filter((c) => {
    const cumpleEstado = filtroEstado ? c.estado === filtroEstado : true;
    return cumpleEstado;
  });

  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    const da = new Date(`${a.fecha}T${a.hora}:00`);
    const db = new Date(`${b.fecha}T${b.hora}:00`);
    return ordenFecha === 'reciente' ? db - da : da - db;
  });

  const confirmarCita = (id) => {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: 'Confirmada' } : c)));
  };

  const cancelarCita = (id) => {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: 'Cancelada' } : c)));
  };

  const notificarPorEmail = (cita) => {
    // Simulación de notificación por email con modal propio
    console.log(`Notificando por email a ${cita.email} para la cita ${cita.id}`);
    setEmailNotificado(cita.email);
    setShowEmailInfo(true);
  };

  const formatFecha = (isoDateStr) => {
    // Esperado: YYYY-MM-DD → Devuelve: DD-MM-YYYY
    const [y, m, d] = isoDateStr.split('-');
    return `${d}-${m}-${y}`;
  };

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

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDeletion = async () => {
    if (confirmDeleteId) {
      await deleteObraSocial(confirmDeleteId);
    }
    setShowConfirm(false);
    setConfirmDeleteId(null);
  };

  const cancelDeletion = () => {
    setShowConfirm(false);
    setConfirmDeleteId(null);
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

          {/* Modal de Obra Social */}
          {showObraSocialForm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">{editingObraSocial ? 'Editar' : 'Nueva'} Obra Social</h3>
                  <button className="modal-close" onClick={handleCancel} aria-label="Cerrar">
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
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
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
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
              </div>
            </div>
          )}

          {/* Modal de confirmación de eliminación */}
          {showConfirm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">Confirmar eliminación</h3>
                  <button className="modal-close" onClick={cancelDeletion} aria-label="Cerrar">
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <p>¿Está seguro de que desea eliminar esta obra social? Esta acción no se puede deshacer.</p>
                  <div className="modal-actions">
                    <button className="btn btn-primary" onClick={confirmDeletion}>Eliminar</button>
                    <button className="btn btn-outline" onClick={cancelDeletion}>Cancelar</button>
                  </div>
                </div>
              </div>
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
          </div>

          {/* Filtros */}
          <div className="citas-filtros">
            <div className="form-group">
              <label className="form-label" htmlFor="ordenFecha">Ordenar por fecha</label>
              <select
                id="ordenFecha"
                className="form-select"
                value={ordenFecha}
                onChange={(e) => setOrdenFecha(e.target.value)}
              >
                <option value="reciente">Más reciente</option>
                <option value="antiguo">Más antiguo</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="filtroEstado">Filtrar por estado</label>
              <select
                id="filtroEstado"
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Solicitada">Solicitada</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Lista de Citas */}
          <div className="citas-list">
            {citasOrdenadas.map((cita) => (
              <div key={cita.id} className="cita-item">
                <div className="cita-info">
                  <div className="cita-id">{cita.id}</div>
                  <div className="cita-detalle">
                    <h4>{cita.paciente}</h4>
                    <p>{formatFecha(cita.fecha)} · {cita.hora}</p>
                    <p className="cita-email"><Mail size={14} /> {cita.email}</p>
                  </div>
                </div>
                <div className="cita-estado">
                  <span className={`status ${
                    cita.estado === 'Confirmada' ? 'active' : 
                    cita.estado === 'Cancelada' ? 'cancelled' : 'pending'
                  }`}>{cita.estado}</span>
                </div>
                <div className="cita-actions">
                  {cita.estado === 'Solicitada' && (
                    <button className="btn btn-primary" onClick={() => confirmarCita(cita.id)}>
                      <CheckCircle size={16} /> Confirmar
                    </button>
                  )}
                  {(cita.estado === 'Solicitada' || cita.estado === 'Confirmada') && (
                    <button className="btn btn-outline btn-danger" onClick={() => cancelarCita(cita.id)}>
                      <X size={16} /> Cancelar
                    </button>
                  )}
                  <button className="btn btn-outline" onClick={() => notificarPorEmail(cita)}>
                    <Mail size={16} /> Notificar Email
                  </button>
                </div>
              </div>
            ))}
            {citasOrdenadas.length === 0 && (
              <div className="citas-vacio">No hay citas para los filtros seleccionados.</div>
            )}
          </div>
        </div>

        {/* Modal de notificación enviada */}
        {showEmailInfo && (
          <div className="modal-overlay">
            <div className="modal email-info">
              <div className="modal-header">
                <h3 className="modal-title">Notificación enviada</h3>
                <button className="modal-close" onClick={() => setShowEmailInfo(false)} aria-label="Cerrar">
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p>Se ha enviado el mail a "{emailNotificado}".</p>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => setShowEmailInfo(false)}>Continuar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
