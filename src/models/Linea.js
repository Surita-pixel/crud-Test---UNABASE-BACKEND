import mongoose from 'mongoose';

const lineaSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  movimiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movimiento',
    required: true,
  },
  numbers: {
    sumPrice: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 },
    },
    sumBudget: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 },
    },
    budgetUtility: {
      value: { type: String, default: '$ 0' },
      lastValue: { type: String, default: '$ 0' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 },
    },
    budgetMargin: {
      value: { type: String, default: '0 %' },
      lastValue: { type: String, default: '0 %' },
      number: { type: Number, default: 0 },
      lastNumber: { type: Number, default: 0 },
    },
  },
});

lineaSchema.pre('findOneAndDelete', async function (next) {
  const lineaId = this.getQuery()._id;

  await mongoose.model('Linea').deleteMany({ movimiento: lineaId });

  next();
});

const Linea = mongoose.model('Linea', lineaSchema);
export default Linea;
