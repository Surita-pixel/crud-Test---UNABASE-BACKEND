import express from 'express';
import { verificarToken } from '../libs/middlewares.js';
import {
    crearLinea,
    obtenerLineasPorMovimiento,
    eliminarLineas,
    actualizarLinea
} from '../controllers/lineaController.js';

const router = express.Router();

router.post('/', verificarToken, crearLinea);
router.get('/:movimientoId', verificarToken, obtenerLineasPorMovimiento);
router.delete('/', verificarToken, eliminarLineas);
router.put('/:id', verificarToken, actualizarLinea);

export default router;