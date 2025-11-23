const mongoose = require('mongoose');

const WorkOrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Activo', required: false },
  assignedTo: { type: String },         // NUEVO
  startDate: { type: Date },            // NUEVO
  endDate: { type: Date },              // NUEVO
  status: { type: String, enum: ['Pendiente', 'En Progreso', 'Completada'], default: 'Pendiente' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Usa el nombre correcto de la variable:
module.exports = mongoose.models.WorkOrder || mongoose.model('WorkOrder', WorkOrderSchema);
