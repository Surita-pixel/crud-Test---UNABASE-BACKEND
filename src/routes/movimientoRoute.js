import express from 'express';
import { verificarToken } from '../libs/middlewares.js';
import {
    crearMovimiento,
    obtenerMovimientosPorProyecto,
    eliminarMovimientos } from '../controllers/movimientoController.js' 

const router = express.Router();

router.post('/', verificarToken, crearMovimiento);
router.get('/:proyectoId', verificarToken, obtenerMovimientosPorProyecto);
router.delete('/', verificarToken, eliminarMovimientos);

export default router;