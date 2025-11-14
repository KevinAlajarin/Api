export default (sequelize, DataTypes) => {
    const ObraSocial = sequelize.define('ObraSocial', {
        // El 'id' (INTEGER, PRIMARY KEY, AUTO_INCREMENT) se crea automáticamente
        
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // No debería haber dos obras sociales con el mismo nombre
        },
        activa: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // Por defecto, una nueva obra social está activa
        }
    }, {
        // Opciones adicionales
        tableName: 'obras_sociales', // Nombre explícito de la tabla en MySQL
        timestamps: true // Habilita createdAt y updatedAt
    });

    return ObraSocial;
};