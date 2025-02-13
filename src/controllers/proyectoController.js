import Proyecto from '../models/Proyecto.js';

export const crearProyecto = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevoProyecto = new Proyecto({
            nombre,
            descripcion,
            creator: req.usuario.id
        });
        await nuevoProyecto.save();
        res.status(201).json({ mensaje: 'Proyecto creado con éxito', proyecto: nuevoProyecto });
    } catch (error) {
        next(error);
    }
};

export const obtenerProyectos = async (req, res, next) => {
    try {
        const proyectos = await Proyecto.find({ creator: req.usuario.id });
        res.json(proyectos);
    } catch (error) {
        next(error);
    }
};

export const eliminarProyectos = async (req, res, next) => {
    try {
        const { ids } = req.body;
        const result = await Proyecto.deleteMany({ _id: { $in: ids }, creator: req.usuario.id });
        res.json({ mensaje: `${result.deletedCount} proyecto(s) eliminado(s) con éxito` });
    } catch (error) {
        next(error);
    }
};