import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import proyectoRoutes from './routes/proyectoRoute.js';
import movimientoRoutes from './routes/movimientoRoute.js';
import lineaRoutes from './routes/lineaRoute.js'
import Usuario from './models/Usuario.js';
import jwt from 'jsonwebtoken'
import { errorHandler, validarRegistro, verificarToken } from './libs/middlewares.js';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.post('/registro', validarRegistro, async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const nuevoUsuario = new Usuario({ nombre, email, password });
        await nuevoUsuario.save();

        const token = jwt.sign(
            { id: nuevoUsuario._id, email: nuevoUsuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado con éxito',
            token
        });
    } catch (error) {
        next(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ mensaje: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al iniciar sesión', detalles: error });
    }
});

app.use('/proyectos', proyectoRoutes);
app.use('/movimientos', movimientoRoutes);
app.use('/lineas', lineaRoutes);
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Datos inválidos', detalles: err.errors });
    }

    if (err.code === 11000) {
        return res.status(400).json({ error: 'El email ya está registrado' });
    }

    res.status(500).json({ error: 'Ocurrió un error inesperado', detalle: err.message });
});



export { app }