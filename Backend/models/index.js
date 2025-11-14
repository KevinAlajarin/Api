import { Sequelize } from "sequelize";
// Importamos la instancia *configurada* de Sequelize desde tu archivo de config.
// (Asumo que está en 'config/db.js', un nivel arriba de 'models')
import sequelize from "../config/db.js";

// Importamos las *definiciones* de los modelos
// (Asegúrate de que los nombres de archivo coincidan)
// NO TE PREOCUPES si aún no creaste Usuario.js u ObraSocial.js,
// Sequelize es lo suficientemente inteligente para manejarlo si el archivo existe.
// Si el archivo NO existe, simplemente comenta la línea de importación por ahora.

import CitaModel from "./cita.js";
import ObraSocialModel from "./obraSocial.js"; 
// import UsuarioModel from "./Usuario.js"; // (Descomenta cuando lo crees)

// Creamos un objeto 'db' que contendrá todo
const db = {};

// 1. Vinculamos la instancia de Sequelize y el constructor
db.Sequelize = Sequelize; // El constructor de Sequelize
db.sequelize = sequelize; // La instancia conectada

// 2. Inicializamos cada modelo
// Le pasamos la instancia (sequelize) y el tipo de dato (DataTypes)
db.Cita = CitaModel(sequelize, Sequelize.DataTypes);
db.ObraSocial = ObraSocialModel(sequelize, Sequelize.DataTypes);
// db.Usuario = UsuarioModel(sequelize, Sequelize.DataTypes); // (Descomenta cuando lo crees)


// 3. (MUY IMPORTANTE) Definir Asociaciones / Relaciones
// Si tienes relaciones (como 'una Cita pertenece a una ObraSocial'),
// este es el lugar para definirlas.
// Por ejemplo, si seguís el "Plan de Acción" que te di:


db.Cita.belongsTo(db.ObraSocial, { foreignKey: 'obraSocialId' });
db.ObraSocial.hasMany(db.Cita, { foreignKey: 'obraSocialId' });


// 4. Exportamos el objeto 'db' completo
export default db;