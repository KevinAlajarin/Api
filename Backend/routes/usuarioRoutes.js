import express from "express";
import { crearUsuariosIniciales, login } from "../controllers/usuarioController.js";

const router = express.Router();

// Ruta para crear los usuarios por primera vez
// GET http://localhost:3000/api/auth/setup
router.get("/setup", crearUsuariosIniciales);

// Ruta para loguearse
// POST http://localhost:3000/api/auth/login
router.post("/login", login);

export default router;