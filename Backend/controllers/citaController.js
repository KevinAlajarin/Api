import db from '../models/index.js'; // Importamos la DB
import { enviarEmailConfirmacion, enviarEmailCancelacion } from '../services/emailService.js';

const Cita = db.Cita;
const ObraSocial = db.ObraSocial;



const generarHorariosDelDia = (fechaSeleccionada) => {
    const slots = [];
    const horaInicio = 9;
    const horaFin = 18; // El loop va hasta 16
    const ahora = new Date();
    const fechaHoy = ahora.toISOString().split('T')[0];
    const esHoy = (fechaHoy === fechaSeleccionada);

    let minutosActuales = 0;

    if(esHoy) {
        minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    }

    for (let hour = horaInicio; hour < horaFin; hour++) {
        let minutosSlot = hour * 60;
        if (!esHoy || minutosSlot > minutosActuales) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        minutosSlot = hour * 60 + 30;
        if (!esHoy || minutosSlot > minutosActuales) {
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }
    // Esta lógica genera hasta las 16:30
    return slots;
};


export const obtenerDisponibilidad = async (req, res) => {
    const { fecha } = req.query; // Recibimos la fecha: "YYYY-MM-DD"

    if (!fecha) {
        return res.status(400).json({ message: 'La fecha es requerida' });
    }

    try {
        // 1. Obtener todos los horarios posibles
        const todosLosSlots = generarHorariosDelDia(fecha);

        // 2. Buscar en la DB los horarios ya ocupados para esa fecha
        const citasOcupadas = await Cita.findAll({
            where: { fecha: fecha },
            attributes: ['horario'] // Solo necesitamos saber el horario
        });

        // 3. Crear una lista (Set) de los horarios ocupados
        const horariosOcupados = new Set(citasOcupadas.map(cita => cita.horario));

        // 4. Filtrar la lista completa, devolviendo solo los libres
        const slotsDisponibles = todosLosSlots.filter(slot => !horariosOcupados.has(slot));

        // 5. Devolver la lista de horarios libres
        res.json({ slots: slotsDisponibles });

    } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Crear cita
export const crearCita = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, obraSocialId, fecha, horario } = req.body;

    const nuevaCita = await Cita.create({
            nombre,
            apellido,
            telefono,
            email,
            obraSocialId, // CAMBIO: Usamos obraSocialId
            fecha,
            horario
    });

    res.status(201).json(nuevaCita);
  } catch (error) {
    console.error("❌ Error al crear cita:", error);
    res.status(500).json({ mensaje: "Error al crear cita", error: error.message });
  }
};

// Obtener todas las citas
export const obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            // Usamos 'include' para traer los datos de la tabla asociada
            include: [{
                model: ObraSocial,
                attributes: ['nombre'] // Solo traemos el nombre de la obra social
            }],
            // Opcional: ordenar por fecha
            order: [['fecha', 'DESC'], ['horario', 'DESC']]
        });
        res.json(citas);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ message: 'Error al obtener las citas' });
    }
};

export const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // El nuevo estado (ej: "Confirmada" o "Cancelada")

    // Validación simple
    if (!estado || !['Confirmada', 'Cancelada', 'Pendiente'].includes(estado)) {
        return res.status(400).json({ message: 'El estado proporcionado no es válido' });
    }

    try {
        const cita = await Cita.findByPk(id, {
            include: [{
                model: ObraSocial,
                attributes: ['nombre']
            }]
        });
        
        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        // Guardamos el estado anterior para comparar
        const estadoAnterior = cita.estado;

        cita.estado = estado; // Actualizamos el estado
        await cita.save(); // Guardamos los cambios

        // Devolvemos la cita actualizada (con la info de obra social)
        const citaActualizada = await Cita.findByPk(id, {
             include: [{
                model: ObraSocial,
                attributes: ['nombre']
            }]
        });

        // Enviar email de notificación solo si el estado cambió y es Confirmada o Cancelada
        // Solo enviamos email si el estado anterior era diferente (evitamos reenvíos)
        if (estadoAnterior !== estado) {
            try {
                if (estado === 'Confirmada') {
                    await enviarEmailConfirmacion(citaActualizada);
                } else if (estado === 'Cancelada') {
                    await enviarEmailCancelacion(citaActualizada);
                }
            } catch (emailError) {
                // Si falla el envío del email, lo registramos pero no fallamos la actualización
                console.error('⚠️ Error al enviar email de notificación:', emailError);
                // La respuesta sigue siendo exitosa porque la cita se actualizó correctamente
            }
        }

        res.json(citaActualizada); // Devuelve la cita completa y actualizada
    } catch (error) {
        console.error("Error al actualizar estado de la cita:", error);
        res.status(500).json({ message: 'Error al actualizar la cita' });
    }
};
