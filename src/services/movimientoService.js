import Movimiento from '../models/Movimiento.js';

export const crearMovimiento = async (name, proyecto, creator) => {
    const nuevoMovimiento = new Movimiento({ name, proyecto, creator });
    return await nuevoMovimiento.save();
};

export const obtenerMovimientosPorProyecto = async (proyectoId) => {
    return await Movimiento.find({ proyecto: proyectoId })
        .populate('creator', 'nombre email')
        .populate('proyecto', 'nombre');
};

export const eliminarMovimientos = async (ids) => {
    return await Movimiento.deleteMany({ _id: { $in: ids } });
};