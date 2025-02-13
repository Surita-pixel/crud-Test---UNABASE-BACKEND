import Linea from '../models/Linea.js';
import Movimiento from '../models/Movimiento.js';
import { formatCurrency } from '../libs/utils.js';

export const crearLinea = async (name, movimientoId, creator) => {
    const movimiento = await Movimiento.findById(movimientoId);
    if (!movimiento) {
        throw new Error('Movimiento no encontrado');
    }

    const nuevaLinea = new Linea({ name, movimiento: movimientoId, creator });
    return await nuevaLinea.save();
};

export const obtenerLineasPorMovimiento = async (movimientoId) => {
    return await Linea.find({ movimiento: movimientoId });
};

export const eliminarLineas = async (lineasIds) => {
    return await Linea.deleteMany({ _id: { $in: lineasIds } });
};

export const actualizarLinea = async (id, sumPrice, sumBudget) => {
    const linea = await Linea.findById(id).populate('movimiento');
    if (!linea) {
        throw new Error('Línea no encontrada');
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



    return linea;
};