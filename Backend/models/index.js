import { Sequelize } from "sequelize";

import sequelize from "../config/db.js";
import CitaModel from "./cita.js";
import ObraSocialModel from "./obraSocial.js"; 
import UsuarioModel from "./usuario.js";


const db = {};


db.Sequelize = Sequelize; 
db.sequelize = sequelize; 


db.Cita = CitaModel(sequelize, Sequelize.DataTypes);
db.ObraSocial = ObraSocialModel(sequelize, Sequelize.DataTypes);
db.Usuario = UsuarioModel(sequelize, Sequelize.DataTypes); 





db.Cita.belongsTo(db.ObraSocial, { foreignKey: 'obraSocialId' });
db.ObraSocial.hasMany(db.Cita, { foreignKey: 'obraSocialId' });



export default db;