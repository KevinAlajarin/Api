import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false, // 'medico' o 'asistente'
            defaultValue: 'asistente'
        }
    }, {
        tableName: 'usuarios',
        timestamps: true,
        hooks: {
            // Antes de crear el usuario, hasheamos la contraseña
            beforeCreate: async (usuario) => {
                if (usuario.password) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            }
        }
    });

    // Método para comparar contraseña al hacer login
    Usuario.prototype.validPassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    return Usuario;
};