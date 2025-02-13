import mongoose from 'mongoose';

const movimientoSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  creator: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true
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

const Movimiento = mongoose.model('Movimiento', movimientoSchema);

export default Movimiento;
