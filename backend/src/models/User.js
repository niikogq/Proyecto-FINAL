const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: 
  { type: String, 
    enum: ['admin', 'tecnico', 'supervisor'],
    default: 'tecnico',
  },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  creado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);