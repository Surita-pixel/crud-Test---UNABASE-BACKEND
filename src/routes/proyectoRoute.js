import express from 'express';
import { verificarToken } from '../libs/middlewares.js';
import { crearProyecto, obtenerProyectos, eliminarProyectos } from '../controllers/proyectoController.js';

const router = express.Router();

router.post('/', verificarToken, crearProyecto);
router.get('/', verificarToken, obtenerProyectos);
router.delete('/', verificarToken, eliminarProyectos);

export default router;