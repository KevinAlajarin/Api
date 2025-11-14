export default (sequelize, DataTypes) => {
    const Cita = sequelize.define('Cita', {
        // Campos que ya tenías
        nombre: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        apellido: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        telefono: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        fecha: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        horario: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },

        // CAMBIO IMPORTANTE:
        // Borramos el campo 'obraSocial' (string)
        // y lo reemplazamos por 'obraSocialId' (INTEGER)
        // que es la "llave foránea" (foreign key)
        obraSocialId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'obras_sociales', // Nombre de la tabla de obras sociales
                key: 'id'
            }
        }, 
        
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            // Usamos 'Solicitada' porque tu Admin.jsx ya usa ese término
            defaultValue: 'Solicitada' 
        }

    }, {
        tableName: 'citas',
        timestamps: true,
    });

    return Cita;
};