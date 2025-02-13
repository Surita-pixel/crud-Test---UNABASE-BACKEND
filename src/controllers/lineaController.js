import Linea from '../models/Linea.js';
import Movimiento from '../models/Movimiento.js';
import Proyecto from '../models/Proyecto.js';
import { formatCurrency } from '../libs/utils.js'; 

export const crearLinea = async (req, res, next) => {
    try {
        const { name, movimientoId } = req.body;

        const movimiento = await Movimiento.findById(movimientoId);
        if (!movimiento) {
            return res.status(404).json({ error: 'Movimiento no encontrado' });
        }

        const nuevaLinea = new Linea({
            name,
            movimiento: movimientoId,
            creator: req.usuario.id
        });

        await nuevaLinea.save();

        res.status(201).json({
            mensaje: 'Línea creada con éxito',
            linea: nuevaLinea
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerLineasPorMovimiento = async (req, res, next) => {
    try {
        const { movimientoId } = req.params;
        const lineas = await Linea.find({ movimiento: movimientoId });
        res.json(lineas);
    } catch (error) {
        next(error);
    }
};

export const eliminarLineas = async (req, res, next) => {
    try {
        const { lineasIds } = req.body;

        if (!Array.isArray(lineasIds)) {
            return res.status(400).json({ error: 'Se requiere un array de IDs para eliminar líneas' });
        }

        await Linea.deleteMany({ _id: { $in: lineasIds } });

        res.json({ mensaje: 'Líneas eliminadas con éxito' });
    } catch (error) {
        next(error);
    }
};

export const actualizarLinea = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { sumPrice, sumBudget } = req.body;

        const linea = await Linea.findById(id).populate('movimiento');
        if (!linea) {
            return res.status(404).json({ error: 'Línea no encontrada' });
        }

        // Actualizar valores de la línea
        linea.numbers.sumPrice.number = sumPrice;
        linea.numbers.sumBudget.number = sumBudget;
        linea.numbers.sumPrice.value = formatCurrency(sumPrice);
        linea.numbers.sumBudget.value = formatCurrency(sumBudget);

        const utilidadLinea = sumBudget - sumPrice;
        const margenLinea = sumBudget === 0 ? 0 : (utilidadLinea / sumBudget) * 100;

        linea.numbers.budgetUtility.number = utilidadLinea;
        linea.numbers.budgetUtility.value = formatCurrency(utilidadLinea);
        linea.numbers.budgetMargin.number = margenLinea;
        linea.numbers.budgetMargin.value = `${margenLinea.toFixed(2)}%`;

        await linea.save();

        // Actualizar valores del movimiento
        const movimientoId = linea.movimiento._id;
        const lineasMovimiento = await Linea.find({ movimiento: movimientoId });

        const sumPriceMovimiento = lineasMovimiento.reduce((acc, l) => acc + l.numbers.sumPrice.number, 0);
        const sumBudgetMovimiento = lineasMovimiento.reduce((acc, l) => acc + l.numbers.sumBudget.number, 0);
        const utilidadMovimiento = sumBudgetMovimiento - sumPriceMovimiento;
        const margenMovimiento = sumBudgetMovimiento === 0 ? 0 : (utilidadMovimiento / sumBudgetMovimiento) * 100;

        linea.movimiento.numbers.sumPrice.number = sumPriceMovimiento;
        linea.movimiento.numbers.sumBudget.number = sumBudgetMovimiento;
        linea.movimiento.numbers.budgetUtility.number = utilidadMovimiento;
        linea.movimiento.numbers.budgetMargin.number = margenMovimiento;

        linea.movimiento.numbers.sumPrice.value = formatCurrency(sumPriceMovimiento);
        linea.movimiento.numbers.sumBudget.value = formatCurrency(sumBudgetMovimiento);
        linea.movimiento.numbers.budgetUtility.value = formatCurrency(utilidadMovimiento);
        linea.movimiento.numbers.budgetMargin.value = `${margenMovimiento.toFixed(2)}%`;

        await linea.movimiento.save();

        // Actualizar valores del proyecto
        const proyectoId = linea.movimiento.proyecto;
        const movimientosProyecto = await Movimiento.find({ proyecto: proyectoId });

        const sumPriceProyecto = movimientosProyecto.reduce((acc, m) => acc + m.numbers.sumPrice.number, 0);
        const sumBudgetProyecto = movimientosProyecto.reduce((acc, m) => acc + m.numbers.sumBudget.number, 0);
        const utilidadProyecto = sumBudgetProyecto - sumPriceProyecto;
        const margenProyecto = sumBudgetProyecto === 0 ? 0 : (utilidadProyecto / sumBudgetProyecto) * 100;

        const proyecto = await Proyecto.findById(proyectoId);
        if (proyecto) {
            proyecto.numbers.sumPrice.number = sumPriceProyecto;
            proyecto.numbers.sumBudget.number = sumBudgetProyecto;
            proyecto.numbers.budgetUtility.number = utilidadProyecto;
            proyecto.numbers.budgetMargin.number = margenProyecto;

            proyecto.numbers.sumPrice.value = formatCurrency(sumPriceProyecto);
            proyecto.numbers.sumBudget.value = formatCurrency(sumBudgetProyecto);
            proyecto.numbers.budgetUtility.value = formatCurrency(utilidadProyecto);
            proyecto.numbers.budgetMargin.value = `${margenProyecto.toFixed(2)}%`;

            await proyecto.save();
        }

        res.json({
            mensaje: 'Valores de línea y cálculos en movimiento y proyecto actualizados con éxito',
            linea
        });
    } catch (error) {
        next(error);
    }
};