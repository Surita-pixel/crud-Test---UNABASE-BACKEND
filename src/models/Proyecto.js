import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, default: '' },
  creator: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  numbers: {
    sumPrice: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 }
    },
    sumBudget: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 }
    },
    budgetUtility: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 }
    },
    budgetMargin: {
      value: { type: String, default: '0 %' },
      lastValue: { type: String, default: '0 %' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 }
    }
  }
});


proyectoSchema.pre(['findOneAndDelete', 'deleteOne'], async function (next) {
  const proyectoId = this.getQuery()._id;

  const movimientosIds = await mongoose.model('Movimiento').distinct('_id', { proyecto: proyectoId });

  if (movimientosIds.length > 0) {
      await mongoose.model('Linea').deleteMany({ movimiento: { $in: movimientosIds } });
      await mongoose.model('Movimiento').deleteMany({ proyecto: proyectoId });
  }

  next();
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;
