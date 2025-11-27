import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js"; 
import citaRoutes from "./routes/citaRoutes.js";
import obraSocialRoutes from "./routes/obraSocialRoutes.js";
import authRoutes from "./routes/usuarioRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/citas", citaRoutes);

app.use("/api/obras-sociales", obraSocialRoutes)

app.use("/api/auth", authRoutes);

// Conectar con la base de datos
const PORT = process.env.PORT || 3000;

// 4. Usamos 'db.sequelize' para sincronizar
sequelize.sync({ alter: true }) // crea o actualiza tablas
    .then(() => {
        console.log("✅ Conectado a MySQL con Sequelize");
        app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
    })
    .catch(err => console.error("❌ Error al conectar con MySQL:", err));