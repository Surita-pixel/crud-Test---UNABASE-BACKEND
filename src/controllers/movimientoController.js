import {
    crearMovimiento as crearMovimientoService,
    obtenerMovimientosPorProyecto as obtenerMovimientosPorProyectoService,
    eliminarMovimientos as eliminarMovimientosService
} from '../services/movimientoService.js';

export const crearMovimiento = async (req, res, next) => {
    try {
        const { name, proyecto } = req.body;

        if (!proyecto) {
            return res.status(400).json({ error: 'El campo proyecto es obligatorio' });
        }

        const nuevoMovimiento = await crearMovimientoService(name, proyecto, req.usuario.id);

        res.status(201).json({
            mensaje: 'Movimiento creado con éxito',
            movimiento: nuevoMovimiento
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerMovimientosPorProyecto = async (req, res, next) => {
    try {
        const { proyectoId } = req.params;
        const movimientos = await obtenerMovimientosPorProyectoService(proyectoId);
        res.json(movimientos);
    } catch (error) {
        next(error);
    }
};

export const eliminarMovimientos = async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de IDs para eliminar movimientos' });
        }

        const resultado = await eliminarMovimientosService(ids);

        res.json({
            mensaje: `${resultado.deletedCount} movimiento(s) eliminado(s) con éxito`
        });
    } catch (error) {
        next(error);
    }
};