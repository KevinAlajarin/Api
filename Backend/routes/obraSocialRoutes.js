import express from "express";
import { obtenerObrasSociales, crearObraSocial, actualizarObraSocial, eliminarObraSocial } from "../controllers/obraSocialController.js";

const router = express.Router();

router.post("/", crearObraSocial); // POST /api/obras-sociales
router.get("/", obtenerObrasSociales); // GET /api/obras-sociales
router.put("/:id", actualizarObraSocial); // PUT /api/obras-sociales/123
router.delete("/:id", eliminarObraSocial); // DELETE /api/obras-sociales/123

export default router;
