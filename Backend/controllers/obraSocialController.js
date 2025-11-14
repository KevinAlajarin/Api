// controllers/obraSocialController.js
import db from '../models/index.js';
const ObraSocial = db.ObraSocial;
const Cita = db.Cita;
// GET /api/obras-sociales
// Obtiene todas las obras sociales
export const obtenerObrasSociales = async (req, res) => {
    try {
        const obras = await ObraSocial.findAll({
            order: [['nombre', 'ASC']] // Ordenadas alfabéticamente
        });
        res.json(obras);
    } catch (error) {
        console.error("Error al obtener obras sociales:", error);
        res.status(500).json({ message: 'Error al obtener obras sociales' });
    }
};

// POST /api/obras-sociales
// Crea una nueva obra social
export const crearObraSocial = async (req, res) => {
    const { nombre, activa } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre es requerido' });
    }

    try {
        const nuevaObraSocial = await ObraSocial.create({
            nombre: nombre.trim(),
            activa: activa // Si 'activa' no viene, usará el defaultValue (true)
        });
        res.status(201).json(nuevaObraSocial);
    } catch (error) {
        console.error("Error al crear obra social:", error);
        // Manejar error de duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ya existe una obra social con ese nombre' });
        }
        res.status(500).json({ message: 'Error al crear la obra social' });
    }
};

// PUT /api/obras-sociales/:id
// Actualiza una obra social (para cambiar nombre o estado 'activa')
export const actualizarObraSocial = async (req, res) => {
    const { id } = req.params;
    const { nombre, activa } = req.body;

    try {
        const obra = await ObraSocial.findByPk(id);
        if (!obra) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        }

        // Actualiza solo los campos que vienen en el body
        if (nombre !== undefined) obra.nombre = nombre.trim();
        if (activa !== undefined) obra.activa = activa;

        await obra.save();
        res.json(obra); // Devuelve la obra social actualizada
    } catch (error) {
        console.error("Error al actualizar obra social:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ya existe una obra social con ese nombre' });
        }
        res.status(500).json({ message: 'Error al actualizar la obra social' });
    }
};

// DELETE /api/obras-sociales/:id
// Elimina una obra social
export const eliminarObraSocial = async (req, res) => {
    const { id } = req.params;

    try {
        const obra = await ObraSocial.findByPk(id);
        if (!obra) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        }

        const citasAsociadas = await Cita.count({
            where: { obraSocialId: id }
        });

        // 3. Si hay citas, bloqueamos el borrado
        if (citasAsociadas > 0) {
            return res.status(409).json({ // 409 Conflict (Conflicto)
                message: `No se puede eliminar "${obra.nombre}". Ya tiene ${citasAsociadas} cita(s) asociada(s).`
            });
        }
        // NOTA: Deberías chequear si esta obra social tiene citas asociadas
        // antes de borrarla. Por ahora, hacemos un borrado simple.
        await obra.destroy();
        res.status(200).json({ message: 'Obra social eliminada' });
    } catch (error) {
        console.error("Error al eliminar obra social:", error);
        res.status(500).json({ message: 'Error al eliminar la obra social' });
    }
};