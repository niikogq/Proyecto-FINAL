const mongoose = require('mongoose');

const activoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha_adquisicion: Date,
  estado: String
  // Puedes agregar más campos según lo que necesites
});

module.exports = mongoose.model('Activo', activoSchema);