import db from '../models/index.js';
import jwt from 'jsonwebtoken';

const Usuario = db.Usuario;


const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_123';


export const crearUsuariosIniciales = async (req, res) => {
    try {
        
        const count = await Usuario.count();
        if (count > 0) {
            return res.status(400).json({ message: 'Los usuarios ya están creados.' });
        }

       
        await Usuario.create({
            username: 'medico',
            password: 'medico123', 
            role: 'medico'
        });

        
        await Usuario.create({
            username: 'asistente',
            password: 'asistente123', 
            role: 'asistente'
        });

        res.status(201).json({ message: 'Usuarios (medico y asistente) creados con éxito' });

    } catch (error) {
        console.error("Error al crear usuarios iniciales:", error);
        res.status(500).json({ message: 'Error al crear usuarios' });
    }
};


export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ where: { username } });
        
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        
        const esValida = await usuario.validPassword(password);
        if (!esValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, role: usuario.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        
        res.json({
            success: true,
            token,
            user: {
                id: usuario.id,
                username: usuario.username,
                role: usuario.role
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};