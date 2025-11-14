import express from "express";
import { 
    crearCita, 
    obtenerCitas, 
    obtenerDisponibilidad,
    actualizarEstadoCita // <-- 1. Importar la nueva función
} from "../controllers/citaController.js";


const router = express.Router();

router.post("/", crearCita); // POST /api/cita/
router.get("/", obtenerCitas); // GET /api/cita/
router.get("/disponibilidad", obtenerDisponibilidad); // GET /api/cita/disponibilidad
router.put("/:id/estado", actualizarEstadoCita);

export default router;
