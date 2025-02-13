import Proyecto from '../models/Proyecto.js';

export const crearProyecto = async (nombre, descripcion, creator) => {
    const nuevoProyecto = new Proyecto({ nombre, descripcion, creator });
    return await nuevoProyecto.save();
};

export const obtenerProyectosPorUsuario = async (creator) => {
    return await Proyecto.find({ creator });
};

export const eliminarProyectos = async (ids, creator) => {
    return await Proyecto.deleteMany({ _id: { $in: ids }, creator });
};